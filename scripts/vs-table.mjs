#!/usr/bin/env node
/**
 * Tableau comparatif "#vs" — audit et remplacement sur toutes les pages.
 *
 *   node scripts/vs-table.mjs --audit   → montre ce qui varie d'une page à l'autre
 *   node scripts/vs-table.mjs --dry     → montre les fichiers qui seraient modifiés
 *   node scripts/vs-table.mjs           → applique
 *
 * Ne remplace QUE la grille comparative + la note de bas de tableau.
 * L'en-tête de section (eyebrow / h2 / chapô) est laissé intact : il est
 * volontairement unique par page pour le SEO.
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const AUDIT = process.argv.includes('--audit');
const DRY = process.argv.includes('--dry');

const SKIP_DIRS = new Set(['node_modules', 'netlify', 'plugins', 'assets', '.git', 'scripts']);

// Pages dont le tableau #vs a des lignes propres à la page : on ne les écrase
// pas avec le tableau générique, elles sont traitées à la main.
//  - nl/muntautomaat-brussel : lignes "Afstand tot Brussel", "Interventietijd
//    Brussel", "Tweetalig NL/FR" — contenu local à conserver
const EXCLUDE = new Set(['nl/muntautomaat-brussel/index.html']);

// ---------------------------------------------------------------------------
//  Contenu du tableau — source unique de vérité
// ---------------------------------------------------------------------------
const ROWS = {
  fr: [
    ['Fabriqué en',              'Japon, Espagne, Royaume-Uni', 'Belgique'],
    ['Commercialisé et installé', 'Par un revendeur',           'Par nous-mêmes (fabricant)'],
    ['Prix',                     'À partir de 12 000 € HTVA',   '9 900 € HTVA'],
    ['Délai de livraison',       '4 à 10 semaines',             '2 semaines'],
    ["Délai d'intervention",     '2 à 5 jours',                 '&lt; 24 h'],
    ['Logiciel intégré',         'À part',                      'Suite Platform inclus'],
    ['Personnalisation hardware', 'Limitée',                    'Sur mesure'],
    ['Support WhatsApp 24/7',    'Non',                         'Inclus dans Platinum'],
    ['Maintenance',              'Facturée dès la première année', '2 premières années offertes'],
  ],
  nl: [
    ['Gemaakt in',               'Japan, Spanje, Verenigd Koninkrijk', 'België'],
    ['Verkocht en geïnstalleerd', 'Door een dealer',            'Door onszelf (fabrikant)'],
    ['Prijs',                    'Vanaf 12.000 € excl. btw',    '9.900 € excl. btw'],
    ['Levertijd',                '4 tot 10 weken',              '2 weken'],
    ['Interventietijd',          '2 tot 5 dagen',               '&lt; 24 u'],
    ['Geïntegreerde software',   'Apart',                       'Suite Platform inbegrepen'],
    ['Hardware-personalisatie',  'Beperkt',                     'Op maat'],
    ['WhatsApp-support 24/7',    'Nee',                         'Inbegrepen in Platinum'],
    ['Onderhoud',                'Gefactureerd vanaf het eerste jaar', 'Eerste 2 jaar gratis'],
  ],
};

const HEAD = { fr: ['Concurrents', 'CashSystem'], nl: ['Concurrenten', 'CashSystem'] };

const FOOTNOTE = {
  fr: 'Comparaison établie en 08/2026 sur la base des tarifs et conditions de service publiés par les principaux fabricants de monnayeurs automatiques, et de notre expérience d\'installation sur le terrain. Prix concurrents indicatifs pour une configuration équivalente à notre kit complet.',
  nl: 'Vergelijking opgemaakt in 08/2026 op basis van de gepubliceerde tarieven en servicevoorwaarden van de belangrijkste fabrikanten van muntautomaten, en van onze eigen installatie-ervaring. Prijzen van concurrenten zijn indicatief voor een configuratie die gelijkwaardig is aan ons volledige kit.',
};

function buildTable(lang) {
  const [c1, c2] = HEAD[lang];
  const rows = ROWS[lang].map(([label, comp, cs]) => `      <div class="compare-row grid grid-cols-3 text-base">
        <div class="font-semibold">${label}</div>
        <div class="text-center text-[var(--muted)]">${comp}</div>
        <div class="text-center font-bold text-[var(--accent-deep)]">${cs}</div>
      </div>`).join('\n');

  return `    <div class="card-elevated overflow-x-auto">
      <div class="min-w-[520px]">
      <div class="grid grid-cols-3 bg-[var(--ink)] text-white text-base font-semibold">
        <div class="p-4"></div>
        <div class="p-4 text-center">${c1}</div>
        <div class="p-4 text-center bg-[var(--accent)] text-[var(--ink)]">${c2}</div>
      </div>
${rows}
      </div>
    </div>

    <p class="text-sm text-[var(--muted)] mt-4 text-center">
      ${FOOTNOTE[lang]}
    </p>`;
}

// ---------------------------------------------------------------------------
function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) collect(full, out);
    } else if (entry === 'index.html') out.push(full);
  }
  return out;
}

/** Repère la zone à remplacer : de `<div class="card-elevated overflow-x-auto">`
 *  jusqu'à la fin de la note de bas de tableau, à l'intérieur de la section #vs. */
function locate(src) {
  const secStart = src.indexOf('<section id="vs"');
  if (secStart === -1) return null;
  const secEnd = src.indexOf('</section>', secStart);
  if (secEnd === -1) return null;

  const tblStart = src.indexOf('<div class="card-elevated overflow-x-auto">', secStart);
  if (tblStart === -1 || tblStart > secEnd) return null;

  // La note suit le tableau : dernier <p ...> avant </section>
  const noteStart = src.lastIndexOf('<p class="text-sm', secEnd);
  if (noteStart === -1 || noteStart < tblStart) return null;
  const noteEnd = src.indexOf('</p>', noteStart);
  if (noteEnd === -1 || noteEnd > secEnd) return null;

  // On recule jusqu'au début de ligne pour garder l'indentation propre
  let s = tblStart;
  while (s > 0 && src[s - 1] !== '\n') s--;
  return { start: s, end: noteEnd + 4, secStart, secEnd };
}

const files = collect(ROOT).filter((f) => {
  const rel = relative(ROOT, f).split(sep).join('/');
  return !rel.includes('oldindex');
});

let touched = 0;
const groups = {};
const problems = [];

for (const file of files) {
  const rel = relative(ROOT, file).split(sep).join('/');
  const src = readFileSync(file, 'utf8');
  const loc = locate(src);
  if (!loc) {
    if (src.includes('<section id="vs"')) problems.push(`${rel} : section #vs trouvée mais zone non localisée`);
    continue;
  }

  const lang = rel === 'nl/index.html' || rel.startsWith('nl/') ? 'nl' : 'fr';
  const block0 = src.slice(loc.start, loc.end);

  // GARDE-FOU : on ne remplace que les tableaux "Asie / Europe du Sud / CashSystem".
  // Exclut le tableau de financement de /prix-monnayeur-automatique/ et les
  // tableaux 2 colonnes propres aux pages Bruxelles (contenu unique par page).
  if (!/>\s*(Asie|Azië)\s*</.test(block0)) {
    if (!AUDIT) console.log(`      ignoré (pas un tableau Asie/Europe du Sud) : ${rel}`);
    continue;
  }
  if (EXCLUDE.has(rel)) {
    if (!AUDIT) console.log(`      ignoré (lignes propres à la page, traité à la main) : ${rel}`);
    continue;
  }

  if (AUDIT) {
    const header = src.slice(loc.secStart, loc.start);
    const h2 = (header.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [, ''])[1].replace(/\s+/g, ' ').trim();
    const key = createHash('md5').update(src.slice(loc.start, loc.end)).digest('hex').slice(0, 8);
    (groups[key] = groups[key] || []).push(rel);
    console.log(`[${lang}] ${rel}\n      h2 : ${h2}`);
    continue;
  }

  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const block = buildTable(lang).split('\n').join(eol);
  const out = src.slice(0, loc.start) + block + src.slice(loc.end);
  if (out === src) continue;

  if (!DRY) writeFileSync(file, out, 'utf8');
  touched++;
  console.log(`${DRY ? '[dry] ' : ''}[${lang}] ${rel}`);
}

if (AUDIT) {
  console.log(`\nVariantes de markup du tableau : ${Object.keys(groups).length}`);
  for (const [k, v] of Object.entries(groups)) console.log(`  ${k}  ${v.length} fichier(s)  ex: ${v[0]}`);
} else {
  console.log(`\n${touched} fichier(s) ${DRY ? 'à modifier' : 'modifié(s)'}.`);
}
if (problems.length) console.log(`\n⚠ ${problems.length} problème(s) :\n  ${problems.join('\n  ')}`);
