# Module 03 — Utiliser les assistants IA avec méthode

**Durée indicative : 60 min**

## Objectif pédagogique
Obtenir des résultats exploitables avec des prompts structurés, vérifier les erreurs et construire un flux de travail réutilisable sans divulguer de données sensibles.

## Déroulé chronométré
8 min — anatomie d’un prompt ; 10 min — décomposer une tâche ; 10 min — vérification des faits ; 8 min — confidentialité et droits ; 18 min — atelier sur trois exemples ; 6 min — documenter et décider.

## 1. Un modèle de prompt complet
Un prompt efficace donne le contexte, l’objectif, le public, les données disponibles, les contraintes, le format de sortie et les critères de qualité. « Écris un post » laisse trop de décisions au modèle. Une consigne plus utile précise le type d’entreprise, la cible, le problème, le ton, la longueur, le canal, les affirmations autorisées et l’action attendue. Demande au modèle de signaler les informations manquantes plutôt que de les inventer.

Exemple : « Tu aides une petite entreprise belge de services. À partir des informations ci-dessous, propose trois versions d’un e-mail de suivi, chacune de moins de 120 mots. N’invente ni prix ni promesse. Utilise un ton professionnel et cordial. Termine par une question simple. Liste séparément les hypothèses et les éléments à vérifier. » Le prompt n’est pas magique : la qualité des données, la vérification et le jugement humain restent déterminants.

## 2. Décomposer une tâche complexe
Pour une tâche importante, ne demande pas tout en une seule fois. Procède par étapes : définir le résultat attendu, extraire les informations, proposer une structure, rédiger une version, contrôler les critères, puis réviser. Ce découpage permet d’identifier où une erreur est apparue et de corriger sans recommencer entièrement.

Par exemple, pour créer une FAQ client, commence par lister les questions réellement reçues, classe-les, rédige une réponse à partir des politiques existantes et demande une liste de points incertains. Un assistant peut générer des idées, résumer un document ou transformer un brouillon, mais ne doit pas inventer une politique commerciale. Si la réponse engage juridiquement ou financièrement l’entreprise, fais-la vérifier par une personne compétente.

## 3. Vérifier les faits et les sources
Les modèles peuvent produire une réponse fluide mais fausse, mélanger des dates, inventer des références ou ne pas signaler l’incertitude. Pour une information factuelle importante, cherche une source primaire récente : documentation officielle, texte légal, contrat, données internes fiables ou publication de l’organisme concerné. Ouvre la source, vérifie qu’elle soutient exactement l’affirmation et conserve la date de consultation.

Sépare les sorties en trois catégories : faits confirmés, hypothèses à tester et recommandations. Demande des citations ou des liens, mais ne considère pas leur présence comme une preuve qu’ils existent. Vérifie manuellement les chiffres, les formules et les calculs. Pour les décisions à fort impact, ne laisse pas un assistant choisir seul : utilise-le comme aide à la réflexion, pas comme autorité finale.

## 4. Construire une bibliothèque de prompts
Une bibliothèque utile est organisée par tâche, pas une collection de formules virales. Pour chaque prompt, garde un nom, un objectif, les entrées nécessaires, le texte du prompt, un exemple de sortie, les erreurs observées et la date de dernière vérification. Ajoute une version et un responsable. Lorsque le modèle ou les règles changent, reteste les prompts importants.

Mesure le gain réel : temps avant/après, nombre de corrections, taux d’erreurs et satisfaction de la personne qui reçoit le résultat. Si un prompt fait gagner 10 minutes mais crée 15 minutes de vérification, il n’améliore pas le processus. La bonne question n’est pas « l’IA a-t-elle répondu ? », mais « le résultat final est-il correct, utile, sûr et moins coûteux à produire ? ».

## 5. Confidentialité et propriété intellectuelle
N’envoie pas à un outil public des mots de passe, données bancaires, dossiers clients, informations de santé, contrats confidentiels ou fichiers internes sensibles sans avoir vérifié les conditions de traitement et obtenu les autorisations nécessaires. Remplace les noms par des identifiants fictifs lorsque cela suffit. Utilise uniquement les données dont tu as besoin et vérifie les réglages de conservation et d’entraînement proposés par l’outil.

Pour les textes, images, musiques et codes générés, vérifie les conditions d’utilisation de l’outil et les droits associés aux éléments fournis. Un résultat généré n’est pas automatiquement original, exact ou libre de droits. Évite d’imiter à l’identique une personne, une marque ou une œuvre protégée. Conserve les sources et fais une revue humaine avant publication.

## 6. Un workflow reproductible
Documente le processus : déclencheur, données d’entrée, prompt/version, résultat attendu, contrôle, approbateur et procédure en cas d’erreur. Pour les contenus marketing, le contrôle peut inclure les faits, le ton, les droits d’image, les informations commerciales et l’appel à l’action. Pour une automatisation, ajoute un journal et un moyen de revenir à l’étape précédente.

Commence par un petit lot de cas représentatifs, y compris des cas inhabituels. Compare le résultat IA au résultat humain de référence. Si la qualité baisse sur les cas difficiles, réduis le périmètre ou ajoute une étape de validation. N’automatise pas une décision sensible simplement parce qu’elle est techniquement possible.

## Atelier pratique
Atelier de 18 minutes : choisis une tâche répétitive, écris un prompt avec les sept éléments, teste-le sur trois exemples fictifs, vérifie les faits et note les corrections nécessaires. Construis ensuite une mini-fiche de procédure précisant quelles données ne doivent jamais être envoyées à l’outil.

## Livrable attendu
Une bibliothèque de trois prompts testés et une fiche de contrôle qualité.

## Modèle à compléter
```text
NOM DU PROMPT :
OBJECTIF :
CONTEXTE :
ENTRÉES :
CONTRAINTES :
FORMAT ATTENDU :
CRITÈRES DE QUALITÉ :
FAITS À VÉRIFIER :
DONNÉES INTERDITES :
TESTS EFFECTUÉS :
ERREURS OBSERVÉES / VERSION :
```

## Auto-évaluation
- Puis-je expliquer la méthode sans relire le support ?
- Ai-je distingué les faits, les hypothèses et les inconnues ?
- Ai-je un livrable concret et une prochaine action datée ?
- Ai-je vérifié les coûts, les risques et les limites de ce que je présente ?
