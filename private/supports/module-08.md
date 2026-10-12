# Support — Module 08: Automatiser sans perdre le contrôle

Durée indicative : 60 min

## Objectif
Concevoir une automatisation fiable, observable et réversible.

## 1. Schéma d'un workflow
Définis le déclencheur, les données entrantes, les règles, l'action, les erreurs possibles et la personne responsable. Prévois une solution manuelle si l'automatisation échoue.

## 2. Contrôle humain
Pour les décisions sensibles, les paiements, les communications à fort impact et les données personnelles, conserve des vérifications et permissions appropriées. Teste sur un environnement fictif avant la production.

## 3. Journal et incidents
Garde des journaux proportionnés, limite les accès, évite de stocker des données inutiles et définis comment désactiver le workflow en cas de problème.

## Exercice pratique
Crée un diagramme déclencheur → traitement → validation → action → journal, avec au moins trois scénarios d'erreur.

## Livrable attendu
Fiche d'automatisation

## Modèle à compléter
```text
DÉCLENCHEUR :\nENTRÉES :\nRÈGLES :\nACTION :\nVALIDATION HUMAINE :\nERREURS POSSIBLES :\nPLAN DE SECOURS :\nDONNÉES CONSERVÉES :\nQUI PEUT DÉSACTIVER ?
```
