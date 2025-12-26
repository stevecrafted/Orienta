# Guide de Test : Auto-Sauvegarde CV

## 🧪 Tests manuels à effectuer

### Test 1 : Création d'un nouveau CV avec auto-sauvegarde

**Étapes :**
1. Accéder à `/CreateCv`
2. Modifier le nom dans le header : "John Doe"
3. Attendre 2 secondes
4. Vérifier que l'indicateur affiche "✅ Sauvegardé à HH:MM"
5. Ouvrir la console du navigateur et vérifier : `localStorage.getItem('cv-draft')`
6. Vérifier dans la base de données que le CV a été créé

**Résultat attendu :**
- Indicateur passe de "En attente" → "En cours" → "Sauvegardé"
- localStorage contient les données
- Base de données contient le CV

---

### Test 2 : Édition d'un CV existant

**Étapes :**
1. Accéder à `/CreateCv?cvId=1` (remplacer 1 par un ID valide)
2. Attendre le chargement (indicateur de chargement)
3. Vérifier que les données du CV sont chargées
4. Modifier une information
5. Attendre 2 secondes
6. Vérifier que l'indicateur affiche "Sauvegardé"

**Résultat attendu :**
- Le CV se charge correctement
- Les modifications sont sauvegardées
- La base de données est mise à jour

---

### Test 3 : Sauvegarde rapide (debounce)

**Étapes :**
1. Accéder à `/CreateCv`
2. Taper rapidement : "J" "o" "h" "n"
3. Observer l'indicateur
4. Attendre 2 secondes sans taper

**Résultat attendu :**
- L'indicateur ne passe pas à "En cours" pendant la saisie rapide
- L'indicateur passe à "En cours" seulement 2 secondes après la dernière modification
- Une seule sauvegarde est effectuée (pas 4)

---

### Test 4 : Perte de connexion réseau

**Étapes :**
1. Accéder à `/CreateCv`
2. Ouvrir les DevTools → Network → Throttling → Offline
3. Modifier le CV
4. Attendre 2 secondes
5. Observer l'indicateur

**Résultat attendu :**
- L'indicateur affiche "❌ Erreur de sauvegarde" pendant 3 secondes
- localStorage contient toujours les données (sauvegarde locale réussie)
- Console affiche : "Erreur lors de la sauvegarde"

---

### Test 5 : Récupération après perte de connexion

**Étapes :**
1. Suivre le Test 4 (mode Offline)
2. Remettre le réseau en ligne (Throttling → No throttling)
3. Faire une nouvelle modification
4. Attendre 2 secondes

**Résultat attendu :**
- L'indicateur affiche "✅ Sauvegardé"
- La base de données contient les dernières modifications

---

### Test 6 : Fermeture et réouverture du navigateur

**Étapes :**
1. Accéder à `/CreateCv`
2. Modifier le CV (ex: nom = "Test Browser")
3. Attendre la sauvegarde
4. Fermer l'onglet/navigateur
5. Rouvrir et accéder à `/CreateCv`

**Résultat attendu :**
- Le CV "Test Browser" est chargé depuis localStorage
- Aucune perte de données

---

### Test 7 : Modifications multiples

**Étapes :**
1. Accéder à `/CreateCv`
2. Modifier le nom
3. Attendre 2 secondes (sauvegarde)
4. Modifier l'email
5. Attendre 2 secondes (sauvegarde)
6. Modifier le téléphone
7. Attendre 2 secondes (sauvegarde)

**Résultat attendu :**
- 3 sauvegardes distinctes effectuées
- L'indicateur affiche l'heure de la dernière sauvegarde
- Toutes les modifications sont présentes

---

### Test 8 : Vérification du format des données

**Étapes :**
1. Accéder à `/CreateCv`
2. Faire quelques modifications
3. Attendre la sauvegarde
4. Ouvrir la console et exécuter :
```javascript
const data = JSON.parse(localStorage.getItem('cv-draft'))
console.log(data)
```

**Résultat attendu :**
```javascript
{
  resume: {
    header: { name: "...", email: "...", ... },
    sections: [ ... ]
  },
  settings: {
    template: "double-column",
    fontSize: 1,
    ...
  },
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

---

### Test 9 : Performance avec beaucoup de données

**Étapes :**
1. Accéder à `/CreateCv`
2. Ajouter 10 sections d'éducation
3. Ajouter 20 compétences
4. Ajouter 10 projets
5. Faire une modification
6. Observer le délai de sauvegarde

**Résultat attendu :**
- Pas de lag lors de la saisie
- Sauvegarde s'effectue en moins de 1 seconde
- Pas d'erreur "Quota exceeded"

---

### Test 10 : Multi-onglets

**Étapes :**
1. Ouvrir `/CreateCv` dans l'onglet 1
2. Modifier le nom en "Onglet 1"
3. Attendre la sauvegarde
4. Ouvrir `/CreateCv` dans l'onglet 2
5. Vérifier le contenu

**Résultat attendu :**
- Onglet 2 charge les données de l'onglet 1
- localStorage est partagé entre les onglets

---

## 🔍 Vérifications dans la base de données

### Vérifier qu'un CV a été créé

```sql
SELECT * FROM cv ORDER BY id DESC LIMIT 5;
```

### Vérifier le contenu d'un CV

```sql
SELECT id, description_cv FROM cv WHERE id = 1;
```

### Vérifier les CV d'un utilisateur

```sql
SELECT cv.* FROM cv 
JOIN utilisateur ON cv.utilisateur_id = utilisateur.id 
WHERE utilisateur.email = 'test@example.com';
```

---

## 🐛 Checklist de débogage

Si l'auto-sauvegarde ne fonctionne pas :

### Frontend
- [ ] Vérifier la console : erreurs JavaScript ?
- [ ] Vérifier Redux DevTools : l'état change-t-il ?
- [ ] Vérifier Network tab : les requêtes API sont-elles envoyées ?
- [ ] Vérifier localStorage : `localStorage.getItem('cv-draft')`
- [ ] Vérifier que `userId` est défini dans le composant
- [ ] Vérifier que le hook `useAutoSave` est appelé

### Backend
- [ ] Vérifier que Spring Boot est démarré
- [ ] Vérifier les logs backend : erreurs ?
- [ ] Vérifier que l'endpoint `/cvs` existe
- [ ] Vérifier l'authentification JWT
- [ ] Vérifier la connexion à la base de données
- [ ] Vérifier les permissions CORS

### Réseau
- [ ] Vérifier que l'API est accessible
- [ ] Vérifier le statut HTTP des requêtes (200, 401, 500 ?)
- [ ] Vérifier le payload envoyé
- [ ] Vérifier la réponse reçue

---

## 📊 Tests de performance

### Mesurer le temps de sauvegarde

Ajouter dans `useAutoSave.ts` :

```typescript
const save = async () => {
  const startTime = performance.now();
  
  try {
    // ... code de sauvegarde
    
    const endTime = performance.now();
    console.log(`Sauvegarde effectuée en ${(endTime - startTime).toFixed(2)}ms`);
  } catch (error) {
    // ...
  }
}
```

**Temps acceptable :** < 500ms

### Mesurer la taille des données

```javascript
const data = localStorage.getItem('cv-draft')
const sizeInBytes = new Blob([data]).size
const sizeInKB = (sizeInBytes / 1024).toFixed(2)
console.log(`Taille du CV : ${sizeInKB} KB`)
```

**Taille acceptable :** < 500 KB

---

## ✅ Critères de validation

L'implémentation est validée si :

- ✅ Toutes les modifications sont sauvegardées automatiquement
- ✅ Le debounce fonctionne (pas de sauvegarde à chaque touche)
- ✅ L'indicateur affiche le bon statut
- ✅ localStorage et backend sont synchronisés
- ✅ Les erreurs réseau sont gérées
- ✅ Les données peuvent être rechargées
- ✅ Pas de perte de données
- ✅ Performance acceptable (< 500ms)
- ✅ Pas de bugs dans la console
- ✅ Fonctionne avec plusieurs utilisateurs

---

## 📝 Rapport de test

Après les tests, compléter ce tableau :

| Test | Statut | Commentaires |
|------|--------|--------------|
| Test 1 : Création nouveau CV | ⬜ Réussi / ❌ Échoué | |
| Test 2 : Édition CV existant | ⬜ Réussi / ❌ Échoué | |
| Test 3 : Debounce | ⬜ Réussi / ❌ Échoué | |
| Test 4 : Perte connexion | ⬜ Réussi / ❌ Échoué | |
| Test 5 : Récupération | ⬜ Réussi / ❌ Échoué | |
| Test 6 : Fermeture navigateur | ⬜ Réussi / ❌ Échoué | |
| Test 7 : Modifications multiples | ⬜ Réussi / ❌ Échoué | |
| Test 8 : Format données | ⬜ Réussi / ❌ Échoué | |
| Test 9 : Performance | ⬜ Réussi / ❌ Échoué | |
| Test 10 : Multi-onglets | ⬜ Réussi / ❌ Échoué | |

---

**Prochaines étapes :** Si tous les tests passent, l'implémentation est prête pour la production ! 🚀
