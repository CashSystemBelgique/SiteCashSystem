#!/usr/bin/env node
/**
 * Bandeau "Odoo Experience 2026" — pose / retrait en masse.
 *
 *   node scripts/oxp-banner.mjs            → pose le bandeau sur toutes les pages publiques
 *   node scripts/oxp-banner.mjs --remove   → le retire partout
 *   node scripts/oxp-banner.mjs --dry      → liste ce qui serait modifié, sans écrire
 *
 * Le bandeau se masque tout seul en JS après le 26/09/2026 (voir OXP_END).
 * Ce script sert donc surtout à le retirer proprement du HTML après le salon.
 *
 * Ne touche pas : oldindex*.html, les pages /odoo-experience-2026/ elles-mêmes,
 * node_modules, netlify, plugins.
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const REMOVE = process.argv.includes('--remove');
const DRY = process.argv.includes('--dry');

const MARKER_START = '<!-- OXP-BANNER-START -->';
const MARKER_END = '<!-- OXP-BANNER-END -->';
const OXP_END = '2026-09-27T00:00:00+02:00'; // minuit après notre journée de présence

const SKIP_DIRS = new Set(['node_modules', 'netlify', 'plugins', 'assets', '.git', 'scripts']);

function banner(lang) {
  const nl = lang === 'nl';
  const href = nl ? '/nl/odoo-experience-2026/' : '/odoo-experience-2026/';
  const eyebrow = 'Odoo Experience 2026';
  const text = nl
    ? 'Wij staan er op <strong style="color:#fff">26 september</strong> in Brussels Expo — muntautomaat live op Odoo POS.'
    : 'On expose le <strong style="color:#fff">26 septembre</strong> à Brussels Expo — monnayeur en démo live sur Odoo POS.';
  const cta = nl ? 'Slot op de stand reserveren →' : 'Réserver un créneau au stand →';
  const close = nl ? 'Sluiten' : 'Fermer';

  return `${MARKER_START}
<div id="oxp-banner" style="background:#0a0e0d;color:#f5f5f0;border-bottom:1px solid rgba(255,255,255,.1)">
  <div style="max-width:80rem;margin:0 auto;padding:.6rem 1.5rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.35rem 1rem;text-align:center">
    <span style="display:inline-flex;align-items:center;gap:.45rem;flex-shrink:0">
      <span style="width:.375rem;height:.375rem;border-radius:9999px;background:#00C58E;display:inline-block"></span>
      <span style="font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#00C58E">${eyebrow}</span>
    </span>
    <span style="font-size:.9375rem;color:rgba(255,255,255,.8)">${text}</span>
    <a href="${href}" style="font-size:.9375rem;font-weight:600;color:#00C58E;flex-shrink:0;text-decoration:none" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">${cta}</a>
    <button type="button" id="oxp-banner-close" aria-label="${close}" title="${close}" style="background:none;border:0;color:rgba(255,255,255,.4);font-size:1.15rem;line-height:1;cursor:pointer;padding:0 .25rem;flex-shrink:0">&times;</button>
  </div>
</div>
<script>
(function(){
  var b=document.getElementById('oxp-banner');
  if(!b)return;
  var over=Date.now()>=new Date('${OXP_END}').getTime();
  var closed=false;
  try{closed=sessionStorage.getItem('oxpBannerClosed')==='1';}catch(e){}
  if(over||closed){b.parentNode.removeChild(b);return;}
  var c=document.getElementById('oxp-banner-close');
  if(c)c.addEventListener('click',function(){try{sessionStorage.setItem('oxpBannerClosed','1');}catch(e){}b.parentNode.removeChild(b);});
})();
</script>
${MARKER_END}`;
}

function collect(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      collect(full, out);
    } else if (entry === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const files = collect(ROOT).filter((f) => {
  const rel = relative(ROOT, f).split(sep).join('/');
  if (rel.includes('oldindex')) return false;
  if (rel.startsWith('odoo-experience-2026/')) return false;   // la page elle-même
  if (rel.startsWith('nl/odoo-experience-2026/')) return false;
  return true;
});

let touched = 0;
const skipped = [];

for (const file of files) {
  const rel = relative(ROOT, file).split(sep).join('/');
  const src = readFileSync(file, 'utf8');
  const eol = src.includes('\r\n') ? '\r\n' : '\n';
  const has = src.includes(MARKER_START);
  let out = src;

  if (REMOVE) {
    if (!has) { skipped.push(`${rel} (pas de bandeau)`); continue; }
    // Découpe par index plutôt que par regex : les marqueurs sont des chaînes fixes.
    const from = src.indexOf(MARKER_START);
    let to = src.indexOf(MARKER_END, from);
    if (to === -1) { skipped.push(`${rel} (marqueur de fin manquant)`); continue; }
    to += MARKER_END.length;
    // Absorbe uniquement les sauts de ligne ajoutés AVANT le bloc à la pose.
    // Rien après : ceux-là appartenaient déjà au fichier d'origine.
    let start = from;
    while (start > 0 && /[\r\n]/.test(src[start - 1])) start--;
    out = src.slice(0, start) + src.slice(to);
  } else {
    if (has) { skipped.push(`${rel} (déjà posé)`); continue; }
    const m = src.match(/<body[^>]*>/i);
    if (!m) { skipped.push(`${rel} (pas de <body>)`); continue; }
    const lang = rel === 'nl/index.html' || rel.startsWith('nl/') ? 'nl' : 'fr';
    const block = banner(lang).split('\n').join(eol);
    const at = m.index + m[0].length;
    out = src.slice(0, at) + eol + eol + block + src.slice(at);
  }

  if (out !== src) {
    if (!DRY) writeFileSync(file, out, 'utf8');
    touched++;
    console.log(`${DRY ? '[dry] ' : ''}${REMOVE ? 'retiré  ' : 'posé    '} ${rel}`);
  }
}

console.log(`\n${touched} fichier(s) ${REMOVE ? 'nettoyé(s)' : 'modifié(s)'}${DRY ? ' (dry run, rien écrit)' : ''}.`);
if (skipped.length) console.log(`${skipped.length} ignoré(s) :\n  ${skipped.join('\n  ')}`);
