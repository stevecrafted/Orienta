# Documentation Auto-Sauvegarde CV

## Vue d'ensemble

Le système d'auto-sauvegarde permet de sauvegarder automatiquement toutes les modifications apportées au CV en temps réel. Les modifications sont sauvegardées à la fois dans le **localStorage** (sauvegarde locale immédiate) et dans la **base de données backend** (sauvegarde persistante).

## Fonctionnalités

### 1. **Sauvegarde automatique avec debounce**
- Les modifications sont sauvegardées automatiquement après **2 secondes d'inactivité**
- Évite les appels API excessifs lors de la saisie

### 2. **Double sauvegarde**
- **localStorage** : Sauvegarde locale instantanée (backup)
- **Backend API** : Sauvegarde persistante dans la base de données

### 3. **Indicateur visuel**
Un indicateur en temps réel affiche le statut :
- 🔵 **En cours de sauvegarde** : Sauvegarde en cours...
- ✅ **Sauvegardé** : Sauvegardé à HH:MM
- ❌ **Erreur** : Erreur de sauvegarde
- ⚪ **En attente** : En attente de modifications

### 4. **Gestion des états**
- Création d'un nouveau CV
- Édition d'un CV existant
- Mode hors ligne (localStorage uniquement)

## Utilisation

### Configuration de base

```tsx
import ResumeBuilder from "@/components/CreateCV/resume-builder"

export default function CreateCvPage() {
  return (
    <ResumeBuilder 
      utilisateurId={123}        // ID de l'utilisateur connecté
      cvId={456}                 // ID du CV (optionnel, pour édition)
      autoSaveEnabled={true}     // Active l'auto-sauvegarde (true par défaut)
    />
  )
}
```

### Scénario 1 : Création d'un nouveau CV

```tsx
<ResumeBuilder 
  utilisateurId={userId}     // ID de l'utilisateur
  autoSaveEnabled={true}
/>
```

### Scénario 2 : Édition d'un CV existant

```tsx
<ResumeBuilder 
  utilisateurId={userId}     // ID de l'utilisateur
  cvId={cvId}                // ID du CV à éditer
  autoSaveEnabled={true}
/>
```

### Scénario 3 : Désactiver l'auto-sauvegarde

```tsx
<ResumeBuilder 
  autoSaveEnabled={false}    // Désactive l'auto-sauvegarde
/>
```

## Hook personnalisé : `useAutoSave`

Le hook `useAutoSave` peut être utilisé dans n'importe quel composant :

```tsx
import { useAutoSave } from "@/lib/hooks/useAutoSave"

function MyComponent() {
  const { saveStatus, lastSaved, forceSave } = useAutoSave({
    delay: 2000,              // Délai avant sauvegarde (ms)
    enabled: true,            // Active/désactive l'auto-save
    cvId: 123,                // ID du CV (optionnel)
    utilisateurId: 456,       // ID de l'utilisateur
    onSave: () => {
      console.log('Sauvegarde réussie!')
    },
    onError: (error) => {
      console.error('Erreur:', error)
    },
  })

  return (
    <div>
      <p>Status: {saveStatus}</p>
      <button onClick={forceSave}>Sauvegarder maintenant</button>
    </div>
  )
}
```

## API Backend requise

Le système nécessite les endpoints suivants :

### 1. Créer un CV
```
POST /cvs/utilisateur/{utilisateurId}
Body: { descriptionCv: string }
```

### 2. Mettre à jour un CV
```
PUT /cvs/{cvId}
Body: { descriptionCv: string }
```

### 3. Récupérer un CV
```
GET /cvs/{cvId}
Response: { id: number, descriptionCv: string, ... }
```

## Format des données sauvegardées

Les données sont sauvegardées au format JSON dans le champ `descriptionCv` :

```json
{
  "resume": {
    "header": {
      "name": "John Doe",
      "title": "Software Engineer",
      "phone": "+1234567890",
      "email": "john@example.com",
      ...
    },
    "sections": [
      {
        "id": "section-education",
        "type": "education",
        "title": "EDUCATION",
        "content": { ... }
      },
      ...
    ]
  },
  "settings": {
    "template": "double-column",
    "fontSize": 14,
    "fontFamily": "Inter",
    ...
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Récupération des données

### Charger depuis localStorage

```tsx
import { useLoadCv } from "@/lib/hooks/useAutoSave"

function LoadCvComponent() {
  const { loadFromLocalStorage } = useLoadCv()
  
  const handleLoad = () => {
    const data = loadFromLocalStorage()
    if (data) {
      // Restaurer l'état Redux avec les données
    }
  }
  
  return <button onClick={handleLoad}>Charger brouillon</button>
}
```

### Charger depuis l'API

```tsx
import { useLoadCv } from "@/lib/hooks/useAutoSave"
import { useDispatch } from "react-redux"

function LoadCvFromApi({ cvId }: { cvId: number }) {
  const { loadFromApi, isLoading, error } = useLoadCv(cvId)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadFromApi()
      if (data) {
        // Restaurer l'état Redux
        dispatch({ type: 'resume/loadState', payload: data.resume })
        dispatch({ type: 'settings/loadState', payload: data.settings })
      }
    }
    fetchData()
  }, [cvId])
  
  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>
  return <div>CV chargé!</div>
}
```

## Configuration avancée

### Modifier le délai de sauvegarde

```tsx
const { saveStatus } = useAutoSave({
  delay: 5000,  // Sauvegarde après 5 secondes d'inactivité
})
```

### Sauvegarde forcée

```tsx
const { forceSave } = useAutoSave()

// Déclencher une sauvegarde immédiate
<button onClick={forceSave}>
  Sauvegarder maintenant
</button>
```

### Callbacks personnalisés

```tsx
const { saveStatus } = useAutoSave({
  onSave: () => {
    toast.success('CV sauvegardé!')
  },
  onError: (error) => {
    toast.error('Erreur lors de la sauvegarde')
    console.error(error)
  },
})
```

## Gestion d'erreurs

Le système gère automatiquement les erreurs :
- Affichage du statut d'erreur pendant 3 secondes
- Sauvegarde dans localStorage même si l'API échoue
- Logs des erreurs dans la console

## Performance

- **Debounce** : Évite les appels API excessifs
- **Comparaison d'état** : Sauvegarde uniquement si les données ont changé
- **localStorage prioritaire** : Sauvegarde locale immédiate
- **Cleanup automatique** : Nettoyage des timeouts au démontage

## Sécurité

- Les données sont sauvegardées uniquement pour l'utilisateur authentifié
- Validation de l'ID utilisateur avant sauvegarde
- Gestion des erreurs réseau

## Limitations

- Le localStorage est limité à ~5-10 MB selon le navigateur
- Les données localStorage sont spécifiques au navigateur
- Nécessite une authentification pour la sauvegarde backend

## Troubleshooting

### La sauvegarde ne fonctionne pas
1. Vérifier que `utilisateurId` est défini
2. Vérifier la connexion réseau
3. Vérifier les logs de la console
4. Vérifier que l'API backend est accessible

### Les données ne se chargent pas
1. Vérifier que le `cvId` est correct
2. Vérifier les permissions utilisateur
3. Vérifier le format des données dans `descriptionCv`

### Erreur localStorage
1. Vérifier l'espace disponible (quotas du navigateur)
2. Vérifier que le localStorage n'est pas désactivé
3. Vider le cache du navigateur si nécessaire

## Exemples complets

Voir le fichier `Frontend/app/CreateCv/page.tsx` pour un exemple d'implémentation complète.
