# CLAUDE.md — SiteCashSystem

Document de contexte pour Claude Code. À lire en premier à chaque session sur ce repo.

---

## 1. Repo & stack technique

- **Type** : site vitrine HTML statique (pas de framework, pas de build step)
- **Déploiement** : Netlify, branche `main` auto-déployée
- **Domaine** : `https://www.cashsystem.be` (redirect 301 depuis `cashsystem.be` et http)
- **Structure** :
  - `index.html` — accueil
  - `/caisse-automatique/`, `/kiosque-de-paiement-cash/`, `/solution-encaissement-cash/`, `/gestion-caisse-automatique/`, `/monnayeur-automatique-belgique/` — pages piliers
  - `/monnayeur-boulangerie/`, `/monnayeur-horeca/`, `/monnayeur-restaurant/`, `/monnayeur-pour-commerce/`, `/monnayeur-sans-erreur/` — landing pages verticales
  - `sitemap.xml`, `sitemap-index.xml`, `sitemap-images.xml`, `sitemap-images-full.xml`, `robots.txt`
  - `_redirects` — règles Netlify (301, catch-all SPA)
  - `/assets/` — images, logos, vidéos
  - `merci.html` — page de conversion post-formulaire
- **Redirections importantes déjà en place** :
  - `/suite` → `https://suiteplatform.com` (301) — ne pas remettre de contenu `/suite` sur ce site
  - `/caisseautomatique` → `/caisse-automatique/` (legacy)
- **CSS** : Tailwind CDN/utility-first inline dans les HTML
- **Pas de framework, pas de JS app** : tout est pur HTML statique

---

## 2. Le business

**Marque** : CashSystem
**Entité** : fabricant belge (unique) de monnayeurs automatiques et logiciels de caisse associés
**Produit principal** : monnayeur automatique (accepte pièces + billets, rend la monnaie)
**Produit logiciel** : Suite Platform — POS Blazor Server (landing dédiée : `https://suiteplatform.com`). ⚠️ Le nom commercial sur le site web et en communication client est **Suite Platform** (et non "CashSystem Suite", qui est le nom interne du repo `CashSystemSuite`).
**Siège / zone d'action** : Belgique
**Base clients actuelle** : 65+ établissements (affiché sur le site)
**Tarification indicative** (affichée sur le site) : Suite 50 €/mois, leasing ~170 €/mois HT

### Positionnement business
> **Le seul fabricant belge de monnayeurs automatiques de A à Z (hardware + logiciel), avec le meilleur service/maintenance du marché.**

---

## 3. Concurrents à battre sur Google

1. **Glory** (glory-global.com) — leader mondial japonais, énorme mais générique, orienté banques/grands retailers. Point faible : service local lent, cher, pas de personnalisation.
2. **CashDro** (cashdro.com, groupe Azkoyen espagnol) — gros player retail européen, bien référencé. Point faible : revendeurs intermédiaires, pas de fabrication locale, support plus lent.
3. **Cashmatic** — player européen plus petit. Point faible : positionnement moins clair, moins de preuve sociale locale Belgique.

**Comment on les bat en SEO :**
- Ils sont faibles sur le **local SEO Belgique** — c'est notre terrain
- Ils n'ont **pas de landing par vertical** (boulangerie, fastfood, etc.) — on les écrase sur les requêtes niche
- On pousse l'angle **"fabricant belge"** qu'ils ne peuvent pas copier

---

## 4. Clients cibles (personas, par priorité business)

1. **Fastfood** (prio #1) — frites, kebabs, burgers, pizzas à emporter. Flux cash élevé, tickets petits, besoin rapidité, erreurs de caisse fréquentes.
2. **Boulangeries** — cash dominant, multiples petits tickets, besoin d'hygiène (pas de contact cash avec mains qui manipulent la nourriture).
3. **Restaurants** (horeca classique) — tickets plus gros, moins de volume, mais besoin de professionnalisme à la caisse.
4. **Librairies** (nouveau segment) — tickets moyens, clientèle sensible à l'efficacité.
5. **Retail général** (commerces, presse, supérettes, etc.) — divers.

**Note** : base clients actuelle majoritairement horeca, mais **ouverture à tous les types de commerce**. Ne pas restreindre le discours.

### Douleurs typiques à marteler dans le contenu
- Erreurs de caisse en fin de journée
- Vol / coulage interne sur le cash
- Temps perdu à compter la caisse manuellement
- Manipulation du cash = hygiène discutable (fastfood, boulangerie)
- File d'attente à la caisse aux heures de pointe
- Staff qui doit manipuler cash + préparation = ralentissement

---

## 5. Angles différenciants (USPs) — par ordre d'importance déclarée

### USP #1 : **Qualité du service + maintenance + intervention ultra-rapide** (le vrai point fort)
Le client achète **la tranquillité**. Intervention rapide, assistance WhatsApp Platinum, support humain direct (pas de call center).
→ Dans le contenu : mettre en avant les délais d'intervention, les engagements de disponibilité, l'offre Platinum, l'accompagnement.

### USP #2 : **Rapidité & performance produit**
Le monnayeur CashSystem est le **plus rapide et le plus performant** du marché.
→ Dans le contenu : cycles de paiement chronométrés, throughput, comparaisons implicites.

### USP #3 : **Esthétique — premier wow effect**
Le monnayeur frappe visuellement dès qu'on entre dans le commerce. Design soigné, finitions premium, personnalisable.
→ Dans le contenu : images hero de qualité, galerie "nos installations", vidéo si possible, mention "design personnalisé".

### USP #4 : **Fabricant belge de A à Z** (unique sur le marché)
Hardware + logiciel conçus, fabriqués et maintenus en Belgique. Aucun concurrent ne peut copier ce positionnement.
→ Dans le contenu : "Made in Belgium", "conçu et fabriqué à [ville]", "pas d'intermédiaire", "circuit court", drapeau belge visible.

### USP #5 : **Sur-mesure adaptatif**
Capable d'adapter hardware et logiciel aux besoins spécifiques du client (OCR, intégrations, formats personnalisés, etc.).
→ Dans le contenu : étude de cas "client X voulait Y, on a développé Z", mot-clé "solution sur mesure".

### Hiérarchie des messages par page
- **Accueil** : les 5 USPs, ordre décroissant
- **Landings verticales (fastfood, boulangerie…)** : douleur persona d'abord, puis USP rapidité + hygiène + design
- **Pages piliers (caisse-automatique, monnayeur…)** : USP fabricant belge + service

---

## 6. Mots-clés cibles

### Mots-clés principaux (priorité max)
- `caisse automatique` (🇧🇪 local + 🇫🇷 pays voisin)
- `monnayeur automatique` (🇧🇪 local)
- `caisse automatique Belgique`
- `monnayeur automatique Belgique`
- `caisse enregistreuse automatique`
- `fabricant monnayeur Belgique` (longue traîne haute intention)

### Longue traîne verticale (une landing = une requête cible)
- `monnayeur boulangerie` → `/monnayeur-boulangerie/`
- `monnayeur restaurant` / `monnayeur horeca` → `/monnayeur-horeca/`, `/monnayeur-restaurant/`
- `monnayeur fastfood` → ⚠️ pas encore de landing dédiée, **à créer en priorité** (persona #1)
- `monnayeur librairie` → ⚠️ pas encore de landing, **à créer** (nouveau segment)
- `monnayeur pour commerce` → `/monnayeur-pour-commerce/`
- `monnayeur sans erreur` → `/monnayeur-sans-erreur/`

### Longue traîne transactionnelle
- `prix monnayeur automatique`
- `leasing caisse automatique`
- `caisse automatique occasion` (⚠️ à éviter si on ne vend pas d'occasion)
- `installation monnayeur Belgique`
- `maintenance monnayeur`

### Mots-clés NL (à déployer si version NL)
- `automatisch kassasysteem`
- `muntautomaat` / `geldautomaat kassa`
- `kassa bakkerij`
- `kassa horeca`

### Mots-clés EN (pour expansion internationale / pays voisins anglophones)
- `automatic cash register`
- `coin & note recycler`
- `cash management system Belgium`

### Pays voisins à cibler (secondaire)
- **France** : même langue, marché énorme, concurrence Glory/CashDro plus forte
- **Pays-Bas** : NL, opportunité
- **Luxembourg** : FR, petit marché mais peu de concurrence locale
- **Allemagne** : DE, à considérer plus tard avec version DE

---

## 7. Stratégie SEO & règles techniques

### Ce qui manque aujourd'hui (dette SEO prioritaire)
1. **Meta description absente ou faible** sur la plupart des pages → à écrire (155 car, mot-clé principal en début)
2. **Open Graph (og:title, og:description, og:image, og:url, og:locale)** absent → à ajouter partout
3. **Twitter Card** → à ajouter
4. **Schema.org structurés absents** → à ajouter :
   - `Organization` + `LocalBusiness` (sur toutes les pages, avec adresse belge, logo, sameAs réseaux)
   - `Product` (sur pages produit)
   - `SoftwareApplication` (sur mentions Suite)
   - `FAQPage` (sur index.html qui a une FAQ)
   - `BreadcrumbList` (navigation)
   - `Review` / `AggregateRating` si témoignages clients
5. **Hreflang** absent → à ajouter dès qu'on lance NL et EN (`hreflang="fr-BE"`, `nl-BE`, `en`)
6. **Canonical absent ou incorrect** → vérifier et corriger
7. **Alt d'images incomplets** → audit à faire
8. **H1 multiples sur une page** → vérifier (une seule H1 par page)
9. **Sitemap incomplet** : ne contient que 3 URLs alors qu'il y a 11+ pages → compléter
10. **Lazy loading images** — déjà présent en partie, à généraliser
11. **Largest Contentful Paint / Core Web Vitals** → à mesurer

### Règles techniques à respecter dans les PRs/modifs
- **Toujours garder la cohérence** entre les 11+ pages (nav, footer, structure sémantique)
- **Ne jamais dupliquer de contenu** entre deux pages — chaque page = un angle unique
- **Chaque landing verticale** doit avoir :
  - H1 unique et spécifique
  - Meta title ≤ 60 car avec mot-clé en premier
  - Meta description ≤ 155 car
  - Canonical
  - Open Graph complet
  - Schema LocalBusiness + Product
  - Contenu ≥ 500 mots
  - Au moins 3 images avec alt optimisé
  - FAQ propre à la vertical
  - CTA clair (WhatsApp, formulaire, téléphone)

### URLs
- Toutes les URLs finissent par `/` (convention existante)
- Slug en kebab-case, tout en minuscules, mots-clés dans le slug
- Une URL = une intention de recherche = un mot-clé principal

### Performance
- Images en WebP quand possible, avec fallback
- `loading="lazy"` sur toutes les images hors du viewport initial
- Favicons déjà en place (multi-formats)
- CSS inline Tailwind OK, éviter de charger Tailwind CDN complet si possible (optim future)

---

## 8. Ton et style rédactionnel

### Règles de ton
- **Direct, concret, belge** — pas de jargon marketing ronflant
- **Parler des bénéfices**, pas des features techniques
- **Chiffres et preuves** à chaque fois que possible (65+ clients, temps d'intervention X heures, ROI en Y mois)
- **Tu** (tutoiement) en FR autorisé si le persona est artisan/commerçant indépendant, sinon **vous**
- **Pas d'emojis** dans le contenu principal (sauf CTA WhatsApp)
- **Pas de superlatifs invérifiables** ("le meilleur", "unique", "révolutionnaire" sauf quand c'est factuellement vrai — ex: "seul fabricant belge")

### Structure d'une page landing type
1. **Hero** : H1 avec bénéfice principal + phrase d'accroche + CTA + image/vidéo
2. **Le problème du persona** : "Tu gères une boulangerie ? Tu connais ça : [liste des douleurs]"
3. **La solution CashSystem** : présentation concrète
4. **Pourquoi nous (USPs)** : 3-5 cards
5. **Preuve sociale** : témoignages, nb de clients, photos installations
6. **Produits / offres** : blocs visuels
7. **FAQ** : 5-8 questions spécifiques à la vertical
8. **CTA final** : demande de devis, WhatsApp, téléphone

### Exemples de bons CTAs
- "Demander une démo en boutique"
- "Voir le monnayeur en vidéo"
- "Parler à un conseiller sur WhatsApp"
- "Calculer mon leasing"

---

## 9. Multilingue FR / NL / EN

### État actuel
- Site en **FR uniquement**
- Versions NL et EN à construire

### Stratégie multilingue (décidée 2026-04-24)
- **Préfixes d'URL** : FR à la racine `/` (langue par défaut), NL sous `/nl/`, EN sous `/en/`
- **Raison du choix** : concentration du jus SEO sur `cashsystem.be`, setup plus simple, une seule propriété Search Console, autorité non diluée (les sous-domaines auraient divisé l'autorité)
- **Hreflang** obligatoire dans chaque page (`fr-BE`, `nl-BE`, `en` ou `en-BE`)
- **Traductions humaines**, pas auto — la crédibilité locale se perd vite avec du Google Translate
- **NL** = priorité #1 après FR (50% de la Belgique)
- **EN** = priorité #2 (pays voisins + clients internationaux)
- **DE** = plus tard si expansion Allemagne

### Localisation du contenu (pas juste traduction)
- NL : exemples de villes flamandes (Anvers, Gand, Bruges), témoignages clients flamands
- EN : focus expansion, mentionner "Belgian manufacturer", "EU shipping"

---

## 10. Conventions de travail avec Claude

### Principes
- **Approche lean, pas de skill tiers** — tout est construit sur mesure dans ce repo
- **Chaque modif significative = un commit propre** avec message descriptif (voir style ci-dessous)
- **Toujours lire le fichier avant de le modifier**
- **Ne jamais toucher au git sans confirmation explicite** (règle absolue)
- **Un changement SEO = une vérification des 11+ pages impactées** (cohérence)

### Workflow type d'une tâche SEO
1. Annoncer ce qu'on va faire
2. Lire les fichiers concernés
3. Proposer le plan (changements exacts, fichiers touchés)
4. Demander validation
5. Appliquer
6. Demander validation pour commit/push

### Style de commit
Les commits existants sont courts ("mod", "modifs", "mails"). Je recommande d'améliorer vers des messages plus descriptifs, type :
- `seo(schema): add LocalBusiness + Organization on all pages`
- `seo(meta): write optimized descriptions for 11 pages`
- `content(boulangerie): rewrite H1 and intro targeting "monnayeur boulangerie"`
- `content: add /monnayeur-fastfood/ landing page`
- `fix(redirects): add 301 /suite → suiteplatform.com`

### Fichiers à ne pas toucher sans raison
- `robots.txt` (validé, ne pas désindexer par erreur)
- `_redirects` (règles 301 en place, ajouter seulement)
- Sitemaps (regénérer proprement si on ajoute/supprime des pages)
- `oldindex.html` (archive, ignorer)

### Priorités SEO à attaquer (roadmap suggérée)
**Phase 1 — Techniques SEO de base (rapide, impact fort)**
1. Écrire meta descriptions optimisées sur les 11+ pages
2. Ajouter Open Graph + Twitter Card sur toutes les pages
3. Ajouter Schema.org Organization + LocalBusiness (fichier partagé ou inline)
4. Ajouter Schema.org Product sur pages produits
5. Compléter le sitemap.xml (11+ URLs, pas 3)
6. Vérifier/corriger canonicals

**Phase 2 — Contenu (plus long, impact durable)**
7. Créer `/monnayeur-fastfood/` (persona #1 manquant)
8. Créer `/monnayeur-librairie/` (nouveau segment)
9. Étoffer les landings existantes à 800+ mots chacune
10. Ajouter un blog (ex: `/blog/`) avec 10-15 articles piliers (guides, comparatifs, études de cas)

**Phase 3 — Multilingue**
11. Version NL complète
12. Version EN
13. Hreflang

**Phase 4 — Acquisition & backlinks**
14. Fiche Google Business Profile optimisée
15. Présence annuaires pro belges (horeca.be, fedis, etc.)
16. Partenariats contenus (blogs horeca, boulangerie)

---

## 11. Contact & infos de marque

### Identité légale
- **Raison sociale** : CashSystem
- **Adresse siège** : Leuvensesteenweg 21/L, 3070 Kortenberg, Belgique
- **N° TVA** : BE1023776996
- **Pays** : BE

### Contact public
- **Téléphone** : +32 456 40 73 62
- **Email commercial** : sales@cashsystem.be
- **WhatsApp** : +32 456 40 73 62 (même numéro, canal privilégié par la marque — mettre en avant)
- **Slogan / tagline** : "Jamais loin de chez vous ;)" — à utiliser dans sections contact / footer / hero secondaire

### Horaires (pour Schema.org LocalBusiness)
- **openingHours** : `Mo-Su 00:00-23:59` (24/7)
- **⚠️ Clarification importante** : le 24/7 concerne la **maintenance Platinum via WhatsApp** (support technique toujours joignable). Le bureau physique à Kortenberg n'est pas ouvert en permanence. Dans le schema on affiche 24/7 car c'est l'engagement de service. Mettre en évidence dans le contenu : "Support 24/7 via WhatsApp Platinum".

### Réseaux sociaux
- **YouTube** : https://www.youtube.com/@cashsystem
- **Facebook** : ⚠️ à confirmer avec l'utilisateur
- **LinkedIn** : ⚠️ à confirmer avec l'utilisateur
- **Instagram** : ⚠️ à confirmer avec l'utilisateur
- **TikTok** : ⚠️ à confirmer avec l'utilisateur

### Logo & assets visuels
- **Logo principal** : ⚠️ à identifier dans `/assets/` (le plus haute def possible, à utiliser pour `Organization.logo` dans le schema)
- **Image hero par défaut** (fallback Open Graph) : ⚠️ à décider (candidate : `/assets/olea/olea-1.jpg` — monnayeur en situation réelle chez client Olea)

### Données dérivées pour le schema LocalBusiness (template)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.cashsystem.be/#organization",
  "name": "CashSystem",
  "url": "https://www.cashsystem.be",
  "logo": "https://www.cashsystem.be/assets/[LOGO_PATH]",
  "image": "https://www.cashsystem.be/assets/olea/olea-1.jpg",
  "telephone": "+32456407362",
  "email": "sales@cashsystem.be",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Leuvensesteenweg 21/L",
    "postalCode": "3070",
    "addressLocality": "Kortenberg",
    "addressCountry": "BE"
  },
  "vatID": "BE1023776996",
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }],
  "sameAs": [
    "https://www.youtube.com/@cashsystem"
  ]
}
```

---

*Document vivant — à mettre à jour au fil des décisions stratégiques.*
