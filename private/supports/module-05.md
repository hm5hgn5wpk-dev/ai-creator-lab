# Module 05 — Construire un prototype no-code

**Durée indicative : 75 min**

## Objectif pédagogique
Créer une démonstration simple qui teste l’hypothèse principale, documenter le parcours utilisateur et vérifier la qualité avant de montrer le prototype à des prospects.

## Déroulé chronométré
8 min — définir l’hypothèse ; 10 min — dessiner le parcours ; 10 min — choisir les outils ; 25 min — construire la première version ; 12 min — tester le parcours ; 7 min — préparer la démo ; 3 min — noter les limites.

## 1. Le prototype minimum n’est pas un produit miniature
Un prototype sert à réduire une incertitude. Il ne doit pas reproduire toutes les fonctionnalités imaginées. Si l’hypothèse est que les clients veulent un rapport plus rapide, un exemple de rapport manuel peut suffire à tester l’intérêt. Si l’hypothèse est qu’un formulaire réduit les erreurs de collecte, un formulaire fonctionnel avec données fictives peut être pertinent.

Écris la question à laquelle le prototype doit répondre avant de choisir l’outil. Si tu ne peux pas expliquer ce que tu apprendras en le montrant à cinq utilisateurs, le périmètre est probablement trop large. Évite d’ajouter des fonctionnalités parce qu’elles sont amusantes à construire. Chaque élément doit servir l’hypothèse, la compréhension de l’offre ou la sécurité du test.

## 2. Dessiner le parcours utilisateur
Décris les étapes du point de vue de la personne : elle arrive, comprend l’offre, fournit une information, reçoit un résultat et sait quoi faire ensuite. Pour chaque étape, note la question qu’elle se pose, l’action attendue et ce qui pourrait la bloquer. Une interface est utile si elle réduit l’effort et les erreurs, pas seulement si elle paraît moderne.

Dessine le parcours sur papier avant de créer la page. Limite les champs de formulaire aux informations nécessaires. Explique pourquoi une donnée est demandée et comment elle sera utilisée. Pour les tests, utilise des données fictives ou anonymisées. N’intègre pas de vraies données de clients dans un outil sans vérifier les permissions, la sécurité et les obligations de confidentialité.

## 3. Choisir les outils et contrôler les dépendances
Compare les outils selon le coût total, les limites du forfait gratuit, la facilité d’export, la sécurité, les intégrations, la propriété des données et la possibilité de changer de fournisseur. Un outil gratuit peut devenir coûteux lorsque le volume augmente ou que des fonctionnalités essentielles deviennent payantes. Note les abonnements, limites de requêtes et conditions de résiliation.

Commence avec un seul outil par fonction. Pour une première démonstration, une page, un formulaire et un tableur peuvent suffire. Si tu relies plusieurs services, dessine le flux de données et les points de panne. Garde une copie de tes contenus et une procédure de secours. Ne stocke jamais de clés API dans le code public ou dans un dépôt GitHub accessible à tous ; utilise les variables d’environnement du service d’hébergement.

## 4. Construire en petites étapes
Découpe la réalisation en livrables : structure, contenu, formulaire, résultat, messages d’erreur et version mobile. À chaque étape, teste le parcours depuis le début. Prévois les cas inhabituels : champ vide, adresse e-mail invalide, double clic, perte de connexion, donnée inattendue ou service tiers indisponible. Un prototype qui fonctionne uniquement dans ton propre scénario n’est pas prêt à être présenté.

Utilise des données de test et documente ce qui est simulé. Si une étape est réalisée manuellement derrière l’écran, ne prétends pas qu’elle est automatisée. La transparence évite les attentes irréalistes et te permet de tester la valeur sans investir prématurément dans une architecture complexe.

## 5. Faire un test d’utilisabilité
Demande à trois à cinq personnes correspondant au public de réaliser une tâche sans leur expliquer chaque clic. Observe les hésitations, erreurs et questions. Ne leur demande pas uniquement « tu aimes ? » ; demande-leur de décrire ce qu’elles pensent que le produit fait et ce qu’elles feraient ensuite. Note les difficultés sans te justifier pendant le test.

Classe les problèmes par gravité : bloquant, confusion importante, amélioration secondaire. Corrige d’abord ce qui empêche d’atteindre le résultat. Teste à nouveau après les corrections. Le nombre de participants ne permet pas de généraliser statistiquement, mais les tests qualitatifs révèlent souvent des problèmes de compréhension faciles à corriger.

## 6. Contrôle qualité, sécurité et démonstration
Avant une démonstration, vérifie les liens, les textes, l’affichage mobile, les messages d’erreur, les données envoyées et la procédure de retour. Évite de publier une page qui collecte des informations sans information de confidentialité appropriée. N’affiche pas de données de vrais clients, de captures sensibles ou de secrets techniques. Indique clairement si le prototype est une maquette, une version pilote ou un service opérationnel.

Prépare un scénario de démonstration de cinq minutes : le problème, le parcours, le résultat, les limites et la question à poser au prospect. Après la démo, demande quel aspect serait utile, ce qui manque et ce qui empêcherait un achat. Enregistre les retours dans un tableau et distingue les demandes fréquentes des demandes isolées.

## Atelier pratique
Atelier de 30 minutes : écris une hypothèse, dessine le parcours en 5 à 7 étapes, construis une maquette ou une page simple, prépare trois scénarios de test, puis rédige un script de démonstration de cinq minutes. Utilise uniquement des données fictives et note explicitement les éléments simulés.

## Livrable attendu
Un prototype démontrable, un schéma de parcours, une checklist de test et un script de démonstration.

## Modèle à compléter
```text
HYPOTHÈSE TESTÉE :
UTILISATEUR CIBLE :
PARCOURS EN 5–7 ÉTAPES :
OUTILS ET COÛTS :
DONNÉES UTILISÉES :
ÉLÉMENTS SIMULÉS :
SCÉNARIO DE TEST 1 :
SCÉNARIO DE TEST 2 :
SCÉNARIO DE TEST 3 :
PROBLÈMES BLOQUANTS :
LIMITES À EXPLIQUER :
DÉCISION APRÈS TEST :
```

## Auto-évaluation
- Puis-je expliquer la méthode sans relire le support ?
- Ai-je distingué les faits, les hypothèses et les inconnues ?
- Ai-je un livrable concret et une prochaine action datée ?
- Ai-je vérifié les coûts, les risques et les limites de ce que je présente ?
