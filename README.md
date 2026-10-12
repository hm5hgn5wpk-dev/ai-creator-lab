# AI Creator Lab — plateforme de formation

## Inclus
- Site responsive en français.
- Inscription et connexion par e-mail/mot de passe (hash bcrypt).
- Comptes, paiements et sessions stockés dans PostgreSQL (base managée, par exemple Neon).
- Checkout Stripe pour deux offres : 99 € (Starter) et 249 € (Creator).
- Accès aux leçons uniquement après confirmation de paiement par webhook Stripe vérifié, avec vérification du montant et de la devise attendus.
- Livraison des supports de cours via une route protégée.
- 12 modules pédagogiques détaillés, exercices et modèles de travail.
- Page compte avec l'accès à la formation achetée.

## Lancer localement
1. Installer Node.js 20 ou supérieur.
2. Copier `.env.example` vers `.env`.
3. Remplacer `SESSION_SECRET` par une clé aléatoire longue.
4. Créer les deux prix de paiement unique en EUR dans Stripe Test mode et renseigner les `price_...`.
5. `npm install`
6. `npm run dev`
7. Visiter http://localhost:3000

## Tester Stripe localement
Installe Stripe CLI et lance un transfert d'événements webhook vers :
`stripe listen --forward-to localhost:3000/webhooks/stripe`
Copie le secret `whsec_...` donné par la CLI dans `.env`, puis redémarre le serveur.
Utilise des cartes de test Stripe, par exemple 4242 4242 4242 4242 avec une date future et un CVC de test.
Le webhook `checkout.session.completed` donne accès au cours après vérification de l'événement et du paiement.

## Passage en production (obligatoire avant de vendre)
- Héberger sur un service Node.js HTTPS et configurer `DATABASE_URL` avec la chaîne de connexion PostgreSQL de Neon (SSL requis).
- Définir `NODE_ENV=production`, `BASE_URL=https://ton-domaine`, secrets live Stripe et webhook live.
- Utiliser le webhook du tableau de bord Stripe vers `https://ton-domaine/webhooks/stripe`.
- Vérifier les événements, les reçus, le parcours de remboursement, les e-mails de confirmation et la livraison.
- Ajouter un service d'e-mail transactionnel réel (le prototype affiche le statut dans l'espace membre; il n'envoie pas d'e-mail).
- Compléter mentions légales, politique de confidentialité, conditions générales de vente, informations sur le droit de rétractation, TVA et facturation en Belgique/UE.
- Faire une revue de sécurité et un test de bout en bout avant d'accepter des paiements réels.

## Sécurité et limites
Ce projet est un socle de départ, pas une plateforme auditée. Ne pas mettre les clés secrètes dans le code ou dans le navigateur. Ne jamais désactiver la vérification du webhook. Les supports et cours sont éducatifs et ne promettent aucun revenu. Ne pas ajouter de faux témoignages ou de promesses de gains garantis.


## Déploiement sur Render + Neon

1. Crée une base PostgreSQL sur Neon et copie sa chaîne de connexion dans la variable Render `DATABASE_URL`. Garde cette valeur secrète.
2. Dans Render, conserve `NODE_ENV=production`, `BASE_URL` avec l'URL HTTPS publique et un `SESSION_SECRET` aléatoire d'au moins 32 caractères.
3. Vérifie les variables Stripe : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER` et `STRIPE_PRICE_CREATOR` (le code accepte également `STRIPE_PRICE_PRO` comme alias pour le prix Pro). Ne partage jamais ces valeurs.
4. Commit les fichiers du projet à la racine du dépôt GitHub, puis attends que Render termine le déploiement.
5. Teste l'inscription, la déconnexion/reconnexion, un paiement test Starter (6 leçons) et un paiement test Pro (12 leçons) avant de vendre.

**Important concernant les données existantes :** la nouvelle base PostgreSQL est vide au départ. Les comptes et paiements précédemment enregistrés dans l'ancienne SQLite ne sont pas automatiquement transférés par ce changement. Avant de considérer la migration terminée, vérifie les données disponibles et rapproche les paiements déjà encaissés dans Stripe pour rétablir les accès des clients. Ne demande pas aux clients de repayer.
