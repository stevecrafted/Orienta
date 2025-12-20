# Guide rapide : Auto-Sauvegarde CV

## 🚀 Fonctionnalités principales

✅ **Auto-sauvegarde automatique** après 2 secondes d'inactivité  
✅ **Double sauvegarde** : localStorage (instantané) + API backend (persistant)  
✅ **Indicateur visuel** du statut de sauvegarde  
✅ **Chargement automatique** du CV lors de l'ouverture  
✅ **Gestion des erreurs** avec fallback sur localStorage  

---

## 📖 Comment ça marche ?

### 1. **Créer un nouveau CV**

Accédez simplement à la page `/CreateCv` :
```
http://localhost:3000/CreateCv
```

- Toutes les modifications sont **automatiquement sauvegardées**
- Les données sont sauvegardées localement ET dans la base de données
- Un indicateur affiche le statut en temps réel

### 2. **Éditer un CV existant**

Ajoutez le paramètre `cvId` dans l'URL :
```
http://localhost:3000/CreateCv?cvId=123
```

- Le CV sera automatiquement chargé depuis la base de données
- Toutes les modifications seront sauvegardées sur le CV existant

---

## 💡 Exemples d'utilisation

### Exemple 1 : Navigation vers la création
```tsx
import { useRouter } from 'next/navigation'

function MyComponent() {
  const router = useRouter()
  
  const createNewCv = () => {
    router.push('/CreateCv')
  }
  
  return <button onClick={createNewCv}>Créer un CV</button>
}
```

### Exemple 2 : Navigation vers l'édition
```tsx
import { useRouter } from 'next/navigation'

function CvListItem({ cvId }: { cvId: number }) {
  const router = useRouter()
  
  const editCv = () => {
    router.push(`/CreateCv?cvId=${cvId}`)
  }
  
  return <button onClick={editCv}>Éditer</button>
}
```

---

## 🎯 Indicateurs visuels

L'indicateur de sauvegarde affiche 4 états :

| Icône | Statut | Description |
|-------|--------|-------------|
| 🔵 | En cours | Sauvegarde en cours... |
| ✅ | Sauvegardé | Sauvegardé à HH:MM |
| ❌ | Erreur | Erreur de sauvegarde |
| ⚪ | En attente | En attente de modifications |

---

## 🔧 Configuration

### Désactiver l'auto-sauvegarde (si nécessaire)

Éditez `Frontend/app/CreateCv/page.tsx` :

```tsx
<ResumeBuilder 
  utilisateurId={userId}
  cvId={cvId}
  autoSaveEnabled={false}  // ← Désactiver ici
/>
```

### Modifier le délai de sauvegarde

Éditez `Frontend/components/CreateCV/resume-builder.tsx` :

```tsx
const { saveStatus, lastSaved, forceSave } = useAutoSave({
  delay: 5000,  // ← Changer ici (en millisecondes)
  enabled: autoSaveEnabled,
  cvId,
  utilisateurId,
})
```

---

## 🔍 Vérification

### Tester la sauvegarde dans localStorage

Ouvrez la console du navigateur :
```javascript
// Voir le CV sauvegardé
localStorage.getItem('cv-draft')

// Voir l'heure de la dernière sauvegarde
localStorage.getItem('cv-draft-timestamp')
```

### Tester la sauvegarde backend

1. Faites des modifications dans le CV
2. Attendez 2 secondes
3. Vérifiez les logs du navigateur : "CV sauvegardé avec succès"
4. Vérifiez dans la base de données : table `cv`, colonne `description_cv`

---

## ❓ FAQ

### Q: Les modifications sont-elles sauvegardées si je perds la connexion ?
**R:** Oui ! Les modifications sont d'abord sauvegardées dans localStorage. Elles seront synchronisées avec le backend une fois la connexion rétablie.

### Q: Que se passe-t-il si je ferme le navigateur ?
**R:** Les modifications sont dans localStorage. Au prochain chargement, vous pourrez récupérer votre brouillon.

### Q: Comment récupérer un brouillon ?
**R:** Ouvrez simplement `/CreateCv` sans paramètre `cvId`. Le système chargera automatiquement le dernier brouillon depuis localStorage.

### Q: Puis-je forcer une sauvegarde immédiate ?
**R:** Oui, vous pouvez ajouter un bouton avec la fonction `forceSave()` du hook `useAutoSave`.

### Q: Les données sont-elles cryptées ?
**R:** Les données dans localStorage sont en texte clair. Pour la sécurité, utilisez HTTPS en production et implémentez l'authentification JWT.

---

## 🐛 Dépannage

### Problème : L'indicateur affiche "Erreur de sauvegarde"

**Solutions :**
1. Vérifiez que le backend est démarré
2. Vérifiez l'authentification (token JWT valide)
3. Vérifiez les logs dans la console du navigateur
4. Vérifiez les logs du backend Spring Boot

### Problème : Le CV ne se charge pas

**Solutions :**
1. Vérifiez que le `cvId` est correct
2. Vérifiez que le CV existe dans la base de données
3. Vérifiez les permissions de l'utilisateur
4. Essayez de vider le localStorage : `localStorage.clear()`

### Problème : "Quota exceeded" dans localStorage

**Solutions :**
1. Vider le localStorage : `localStorage.clear()`
2. Réduire la taille des données (optimiser les images)
3. Utiliser IndexedDB pour les grandes données

---

## 📚 Documentation complète

Pour plus de détails techniques, consultez :
- [AUTO_SAVE_DOCUMENTATION.md](./AUTO_SAVE_DOCUMENTATION.md)

---

## ✅ Checklist de mise en production

- [ ] Tester la création de CV
- [ ] Tester l'édition de CV
- [ ] Tester la perte de connexion
- [ ] Tester avec plusieurs utilisateurs
- [ ] Vérifier les performances (pas de lag lors de la saisie)
- [ ] Vérifier la sécurité (authentification, autorisations)
- [ ] Configurer les backups de la base de données
- [ ] Ajouter des analytics pour monitorer les sauvegardes

---

**Besoin d'aide ?** Consultez les logs de la console ou contactez l'équipe de développement.
