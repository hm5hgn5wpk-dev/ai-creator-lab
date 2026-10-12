# Module 08 — Automatiser sans perdre le contrôle

**Durée indicative : 60 min**

## Objectif pédagogique
Concevoir une automatisation fiable, documentée, sécurisée et réversible, avec une gestion des erreurs et une supervision humaine adaptée.

## Déroulé chronométré
8 min — cartographier ; 10 min — choisir la tâche ; 12 min — erreurs et doublons ; 10 min — sécurité ; 8 min — supervision et secours ; 9 min — atelier ; 3 min — revue.

## 1. Décrire le workflow de bout en bout
Un workflow se compose d’un déclencheur, d’entrées, de règles, d’actions, d’une sortie et d’un mécanisme de contrôle. Exemple : un formulaire reçu déclenche la création d’une tâche, puis une notification à la personne responsable. Décris ce qui se passe lorsque l’entrée manque, lorsque le service est indisponible ou lorsque le même événement arrive deux fois.

Dessine le flux avant de choisir la plateforme. Pour chaque étape, précise les données utilisées, la personne responsable et le résultat attendu. Les étapes invisibles sont souvent celles qui provoquent les problèmes : permissions, format de date, doublons, quotas, erreurs d’API ou absence de notification. Une automatisation n’est pas complète tant que tu ne sais pas comment elle échoue.

## 2. Automatiser une tâche stable
Automatise d’abord une tâche répétitive, à règles claires et à risque limité. Si le processus change chaque semaine ou nécessite beaucoup de jugement, standardise-le avant de l’automatiser. Mesure le temps et les erreurs actuels, puis compare avec le workflow. Le gain théorique n’est pas suffisant : compte aussi la configuration, la maintenance, la surveillance et les corrections.

Un bon premier cas peut être le classement d’un formulaire, l’envoi d’une confirmation ou la création d’une tâche. Les décisions sensibles — refus, santé, crédit, recrutement ou sanctions — nécessitent une analyse spécifique et une supervision adaptée. Ne laisse pas un modèle génératif prendre seul une décision importante simplement parce qu’il peut produire une réponse.

## 3. Gérer les erreurs et les doublons
Prévois une stratégie pour les échecs : nouvelle tentative limitée, file d’attente, notification et procédure manuelle. Une répétition automatique infinie peut créer des coûts, des messages en double ou des effets indésirables. Utilise un identifiant unique ou une clé d’idempotence lorsqu’une action ne doit être réalisée qu’une fois.

Teste les cas limites : champs vides, caractères inattendus, retard de réponse, service tiers indisponible, limite de requêtes, utilisateur qui clique deux fois et événement reçu en double. Définis une personne qui reçoit l’alerte et un délai de réaction. Sans responsable, le message d’erreur peut rester ignoré pendant des jours.

## 4. Sécurité et données
Accorde aux intégrations les permissions minimales nécessaires. Protège les clés API dans des variables d’environnement ou un gestionnaire de secrets, jamais dans le code public, les captures d’écran ou les documents partagés. Utilise des comptes de service lorsque c’est approprié et révise régulièrement les accès. En cas de fuite, révoque le secret et examine les journaux.

Ne transmets que les données nécessaires. Vérifie les rôles des fournisseurs, les lieux de traitement, les conditions de conservation et les obligations d’information. Pour un test, utilise des données fictives. Ajoute une trace d’exécution qui permet de comprendre ce qui s’est passé sans stocker inutilement des données personnelles ou des contenus sensibles.

## 5. Supervision humaine et procédure de secours
Définis ce qui doit être vérifié par une personne, ce qui peut être exécuté automatiquement et ce qui exige une approbation. Pour un e-mail généré par IA, un brouillon soumis à validation peut être plus sûr qu’un envoi direct. Pour une modification de données, un journal et une possibilité d’annulation sont essentiels.

Documente la procédure manuelle si le workflow s’arrête : qui prend le relais, où retrouver les éléments en attente et comment éviter de traiter deux fois le même dossier. Le système doit pouvoir être désactivé sans bloquer toute l’activité. Teste régulièrement la procédure de secours au lieu de supposer qu’elle fonctionnera le jour d’un incident.

## 6. Mesurer la fiabilité
Suis le taux de réussite, les erreurs par type, les doublons, le délai de traitement, les interventions humaines, le coût par exécution et les incidents de données. Une automatisation qui économise du temps mais provoque des erreurs coûteuses n’est pas une amélioration. Définis un seuil d’alerte et une revue périodique.

Avant de déployer, exécute un pilote sur un petit volume, compare les résultats avec le processus manuel et fais vérifier les cas atypiques. Conserve une version de configuration et une procédure de retour arrière. N’augmente le volume que lorsque les erreurs sont comprises et maîtrisées.

## Atelier pratique
Atelier de 20 minutes : dessine un workflow de 5 à 8 étapes, liste cinq modes d’échec, définis les alertes et le responsable, puis écris une procédure manuelle de secours. Teste mentalement un doublon, une donnée manquante et une indisponibilité de service.

## Livrable attendu
Un diagramme de workflow, une matrice de risques et une checklist de mise en production.

## Modèle à compléter
```text
DÉCLENCHEUR :
ENTRÉES / DONNÉES :
ÉTAPES :
RÈGLES / APPROBATIONS :
SORTIE ATTENDUE :
ERREURS POSSIBLES :
GESTION DES DOUBLONS :
ALERTES / RESPONSABLE :
DONNÉES À PROTÉGER :
PROCÉDURE MANUELLE :
MÉTRIQUES / SEUILS :
PLAN DE RETOUR ARRIÈRE :
```

## Auto-évaluation
- Puis-je expliquer la méthode sans relire le support ?
- Ai-je distingué les faits, les hypothèses et les inconnues ?
- Ai-je un livrable concret et une prochaine action datée ?
- Ai-je vérifié les coûts, les risques et les limites de ce que je présente ?
