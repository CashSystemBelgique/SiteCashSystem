# Phase 4 — Acquisition & Backlinks

Checklist d'actions à réaliser **par l'utilisateur** (CashSystem) directement sur les plateformes externes. Aucun code à committer ici — c'est du paramétrage et des soumissions manuelles.

> Ordre suggéré : **1 → 2 → 3 → 4 → 5**. Compter ~3-4 h au total réparti sur quelques jours (certains points demandent des vérifications par e-mail ou par courrier).

---

## 0. Préalable — adresse légale à la Banque-Carrefour (BLOQUANT pour le point 3)

Le siège et l'atelier ont déménagé à **Avenue de la Couronne 452, 1050 Ixelles** le 21/08/2026. Le site, les modèles de devis et les contrats sont à jour, mais **la Banque-Carrefour des Entreprises (BCE/KBO) ne l'est pas** : ICM INVEST SRL y figure toujours à Kortenberg (3070).

C'est le point de départ de tout le reste : Trends Top, Kompass et une partie des annuaires **recopient la BCE**. Les corriger un par un avant que la source le soit ne sert à rien — ils se resynchroniseront sur l'ancienne adresse.

> Vérifié le 22/08/2026 : https://trendstop.levif.be/fr/detail/1023776996/icm-invest.aspx affiche encore Kortenberg (3070).

**À faire trancher par le comptable ou le notaire** : le déménagement fait passer la société de la **Région flamande** à la **Région de Bruxelles-Capitale**. Selon la rédaction des statuts, un changement de Région peut exiger une modification statutaire par acte notarié et une publication au Moniteur belge, avec un effet possible sur le régime linguistique. Ce n'est pas un simple changement d'adresse administratif — à clarifier avant de soumettre quoi que ce soit aux annuaires.

**Aussi à mettre à jour, hors annuaires** :
- **Odoo** (paramètres de société) — c'est lui qui génère les devis `S000xx` et les factures. Tant qu'il n'est pas corrigé, chaque nouveau document part avec Kortenberg, même si les modèles Word sont à jour.
- Assurances, banque, contrats fournisseurs, en-têtes de facture.

---

## 1. Google Search Console — resoumettre le sitemap

**Pourquoi** : Google a actuellement les anciennes 3 URLs en mémoire. Il faut lui signaler les 13 URLs actuelles (toutes les pages FR du site).

**Comment** :
1. Aller sur https://search.google.com/search-console
2. Sélectionner la propriété `cashsystem.be` (ou la créer si pas encore vérifiée — utiliser la méthode DNS Netlify ou tag HTML)
3. Menu gauche → **Sitemaps**
4. Si l'ancien sitemap apparaît : retirer-le, puis re-ajouter `sitemap.xml`
5. Si pas encore : ajouter `sitemap.xml`
6. Cliquer **Soumettre**

**Bonus** — forcer l'indexation des nouvelles pages (fastfood, librairie) :
- Menu **Inspection d'URL**
- Coller `https://www.cashsystem.be/monnayeur-fastfood/` → **Demander l'indexation**
- Refaire pour `https://www.cashsystem.be/monnayeur-librairie/`

**Vérification** : revenir 2-3 jours plus tard pour voir le rapport "Couverture" — toutes les URLs devraient être en "Valides".

---

## 2. Google Business Profile (ex-Google My Business)

**Pourquoi** : présence forte en local SEO Belgique, fiche affichée dans Google Maps + résultats locaux. Indispensable pour un fabricant local.

**Comment** :
1. Aller sur https://www.google.com/business/
2. Connexion avec ton compte Google `k77nylmz@gmail.com`
3. Créer la fiche **CashSystem** (vérifié le 22/08/2026 : aucune fiche n'existe pour CashSystem — c'est une création, pas une revendication) :
   - **Nom** : CashSystem
   - **Catégorie principale** : "Magasin d'équipement de bureau" ou "Fabricant" (vérifier les options)
   - **Catégories secondaires** : "Service de maintenance d'équipement", "Magasin de matériel d'encaissement"
   - **Adresse** : Avenue de la Couronne 452, 1050 Ixelles, Belgique (NL : Kroonlaan 452, 1050 Elsene) — doit correspondre au mot près à celle du site et du JSON-LD
   - **Téléphone** : +32 456 40 73 62
   - **Site web** : https://www.cashsystem.be
   - **Horaires** : décider si on affiche 24/7 (cohérent avec Schema) ou heures bureau réelles → recommandation = horaires bureau **réels** + mention "Support WhatsApp 24/7" en description
4. **Vérification** : Google envoie un courrier postal avec un code à l'adresse du siège (peut prendre 5-14 jours). Une fois reçu, saisir le code → fiche activée.
5. **Une fois validée**, enrichir :
   - Description : "Fabricant belge de monnayeurs automatiques et caisses automatiques. Le monnayeur le plus rapide du marché, meilleur service technique. Hardware + logiciel Suite Platform. 65+ commerces équipés."
   - Photos : minimum 5 photos (logo, façade siège, machine, équipe, installation client)
   - Vidéo : ajouter `banniere.mp4` du site
   - Services : lister les principaux ("Installation monnayeur", "Maintenance Platinum", "Habillage personnalisé", "Leasing 5 ans")
   - Posts : poster 1 fois/semaine (offre, nouveau client, événement)
   - Avis : demander à 5-10 clients existants de laisser un avis Google → débloque progressivement le badge `aggregateRating` et améliore la note Schema (cf. point Phase 1.5).

**Impact attendu** : présence en haut de la page Google "monnayeur Belgique" sous forme de fiche locale, +30-50% de leads qualifiés sur 3 mois.

---

## 3. Annuaires professionnels belges (backlinks + mentions locales)

**Pourquoi** : chaque mention sur un annuaire pro belge crée un backlink (autorité SEO) + une découverte par un public B2B ciblé.

**Annuaires prioritaires** (gratuits ou peu chers) :

### Généralistes
- **Pages d'Or / Gouden Gids** (https://www.pagesdor.be) — incontournable Belgique
- **Trends Top** (https://www.trendstop.be) — annuaire entreprises belges. **Fiche déjà existante et encore à Kortenberg**, alimentée par la BCE : corriger la BCE d'abord (point 0), sinon la correction sera écrasée
- **Kompass Belgique** (https://be.kompass.com)

### Sectoriels horeca/commerce (clients cibles)
- **Horeca.be** — annuaire fournisseurs horeca
- **Fedis** (Fédération du commerce belge) — adhésion ou mention
- **Bib & Co** (boulangerie) — partenariats
- **Boulangerie.be** — annuaires fournisseurs boulangers

### Plateforme métier (B2B)
- **B2BWaves** ou **Europages Belgique**
- **LinkedIn** (page Entreprise CashSystem si pas encore créée)

**Comment procéder** : pour chaque annuaire, créer un compte avec les infos déjà compilées :
- Nom : CashSystem
- TVA : BE1023776996
- Description courte : "Fabricant belge de monnayeurs automatiques. Le plus rapide du marché. Service technique premium."
- Description longue : reprendre la description du Schema Org/LocalBusiness
- Site : https://www.cashsystem.be
- Catégorie : "Equipement encaissement / Caisses automatiques"

**Time-box** : 2-3 annuaires par semaine, pas plus (Google détecte les soumissions massives comme spam).

---

## 4. Partenariats contenu (backlinks naturels)

**Pourquoi** : un backlink depuis un site de qualité (média horeca, blog boulanger) vaut 50× un backlink d'annuaire. Et le contenu fait vendre directement.

**Ciblage** :
- **Blogs horeca belges** : food.be, gourmet.be, restoplus.be — proposer un article invité sur "comment réduire les erreurs de caisse" / "ROI d'un monnayeur en restaurant"
- **Médias presse régionaux** : L'Echo, Trends-Tendances, Le Soir Eco — communiqué de presse "1er fabricant belge de monnayeurs automatiques, 65+ clients"
- **Chambres de commerce** : CCI Bruxelles, BECI, Voka — devenir membre + apparaître dans annuaire interne
- **Événements salons** : Horeca Expo Gand (mai), Salon des Indépendants — stand ou parrainage

**Time-box** : 1 démarche partenariat / mois, qualité avant quantité.

---

## 5. Google Ads (paid acquisition — optionnel)

**Pourquoi** : le SEO organique met 3-6 mois à porter ses fruits. Google Ads génère des leads dès le 1er jour, à condition que le site convertit bien (ce qui est maintenant le cas avec le bloc pricing 9 900 €).

**État actuel** : tag conversion `AW-17599407948` déjà en place dans le code (visible dans l'index.html ligne ~165). Donc le tracking est prêt.

**Comment démarrer** :
1. Créer une campagne sur https://ads.google.com/
2. Cibler les mots-clés à forte intention :
   - `monnayeur automatique Belgique` (~50-200 €/mois en CPC)
   - `caisse automatique fastfood` (peu concurrentiel)
   - `caisse automatique boulangerie`
3. Budget initial : 300-500 €/mois pour tester sur 1 mois
4. Page de destination : envoyer chaque ad vers la **landing verticale correspondante** (pas l'accueil) — `/monnayeur-boulangerie/` pour ad "monnayeur boulangerie", etc.
5. Mesurer le coût par lead (formulaire envoyé) et ajuster

**Recommandation** : démarrer **après** que tout le multilingue (Phase 3) est en place et que Google Search Console montre que les pages sont bien indexées.

---

## Suivi & métriques (à check tous les mois)

- **Search Console** → impressions / clics / position moyenne par requête
- **Google Analytics** (`G-CQLB8S547L`) → trafic, sources, conversions formulaire
- **Microsoft Clarity** (`tpyxaeb76z`) → enregistrements de session pour comprendre le comportement
- **Leads** → nombre de demandes via formulaire `/merci`, WhatsApp, e-mail commercial

**Objectif réaliste à 6 mois** :
- 5 000+ visites/mois (vs ~500 actuel je suppose)
- Top 3 sur "monnayeur automatique Belgique" et top 5 sur les longues traînes verticales
- 30-50 leads/mois via le site

---

*Document maintenu par Claude pour CashSystem. Mis à jour le 2026-04-27 après Phase 2 SEO.*
