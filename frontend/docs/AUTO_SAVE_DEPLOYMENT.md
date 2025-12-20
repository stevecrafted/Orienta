# 🚀 Guide de déploiement - Auto-Sauvegarde CV

## Checklist avant déploiement

### ✅ Frontend

- [ ] **Tests effectués**
  - [ ] Création de CV fonctionne
  - [ ] Édition de CV fonctionne
  - [ ] Auto-sauvegarde fonctionne
  - [ ] Chargement de CV fonctionne
  - [ ] Mode hors ligne fonctionne
  - [ ] Pas d'erreurs dans la console

- [ ] **Performance vérifiée**
  - [ ] Pas de lag lors de la saisie
  - [ ] Sauvegarde < 500ms
  - [ ] Taille CV < 500 KB

- [ ] **Composant de debug retiré**
  - [ ] Supprimer ou commenter `<AutoSaveDebugPanel />` dans `resume-builder.tsx`
  - [ ] Supprimer les `console.log` de debug

- [ ] **Variables d'environnement configurées**
  - [ ] `NEXT_PUBLIC_API_URL` configurée
  - [ ] URLs absolues pour production

### ✅ Backend

- [ ] **Endpoints vérifiés**
  - [ ] `POST /cvs/utilisateur/{id}` fonctionne
  - [ ] `PUT /cvs/{id}` fonctionne
  - [ ] `GET /cvs/{id}` fonctionne
  - [ ] `GET /cvs/utilisateur/{id}` fonctionne
  - [ ] `DELETE /cvs/{id}` fonctionne

- [ ] **Sécurité configurée**
  - [ ] Authentification JWT active
  - [ ] CORS configuré correctement
  - [ ] Validation des entrées
  - [ ] Autorisations vérifiées

- [ ] **Base de données**
  - [ ] Backups configurés
  - [ ] Index créés (performances)
  - [ ] Connexion sécurisée

### ✅ Infrastructure

- [ ] **HTTPS configuré**
- [ ] **Monitoring configuré**
  - [ ] Logs applicatifs
  - [ ] Alertes erreurs
  - [ ] Métriques performance
- [ ] **Backups configurés**
  - [ ] Base de données
  - [ ] Fichiers statiques

---

## Configuration par environnement

### Développement

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_ENV=development
```

**Fonctionnalités dev :**
- Debug panel activé
- Logs verbeux
- localStorage non chiffré

### Staging

```env
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.example.com/api
NEXT_PUBLIC_ENV=staging
```

**Fonctionnalités staging :**
- Tests E2E
- Debug panel désactivé
- Logs normaux

### Production

```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.example.com/api
NEXT_PUBLIC_ENV=production
```

**Fonctionnalités production :**
- Debug panel désactivé
- Logs minimaux
- Performance optimisée

---

## Étapes de déploiement

### 1. Préparation du code

```bash
# Frontend
cd Frontend

# Installer les dépendances
npm install

# Vérifier les erreurs TypeScript
npm run type-check  # ou: tsc --noEmit

# Builder pour production
npm run build

# Tester le build localement
npm run start
```

### 2. Variables d'environnement

Créer `.env.production` :

```env
NEXT_PUBLIC_API_URL=https://votre-api.com/api
NEXT_PUBLIC_ENV=production
```

### 3. Retirer le debug panel (IMPORTANT)

Éditer `Frontend/components/CreateCV/resume-builder.tsx` :

```tsx
// ❌ RETIRER CETTE LIGNE EN PRODUCTION :
// import AutoSaveDebugPanel from "@/components/CreateCV/AutoSaveDebugPanel"

export default function ResumeBuilder({ ... }) {
  // ... code ...

  return (
    <div className="flex flex-col gap-4">
      {/* ❌ RETIRER CE COMPOSANT EN PRODUCTION : */}
      {/* {process.env.NEXT_PUBLIC_ENV === 'development' && <AutoSaveDebugPanel />} */}
      
      {/* Reste du code... */}
    </div>
  )
}
```

### 4. Optimisations de performance

**Next.js config** (`next.config.ts`) :

```typescript
const config = {
  // ... autres configs ...
  
  // Optimisations
  swcMinify: true,
  compress: true,
  
  // Images
  images: {
    domains: ['votre-cdn.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de cache
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

### 5. Déploiement

**Option A : Vercel (recommandé pour Next.js)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

**Option B : Docker**

```bash
# Build l'image
docker build -t cv-app-frontend -f Frontend/Dockerfile .

# Run le container
docker run -p 3000:3000 cv-app-frontend
```

**Option C : Build manuel**

```bash
# Build
npm run build

# Le dossier .next/ contient le build
# Copier sur votre serveur et exécuter:
npm run start
```

---

## Configuration Backend (Spring Boot)

### application.properties (production)

```properties
# API
server.port=8080
spring.application.name=cv-backend

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/cv_db
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# CORS
cors.allowed.origins=https://votre-frontend.com

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Logs
logging.level.root=INFO
logging.level.com.example=INFO

# Taille max des requêtes (pour CV volumineux)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Index de base de données (performances)

```sql
-- Index sur utilisateur_id pour recherches rapides
CREATE INDEX idx_cv_utilisateur ON cv(utilisateur_id);

-- Index sur date de modification
CREATE INDEX idx_cv_updated ON cv(updated_at);

-- Index composite pour les requêtes fréquentes
CREATE INDEX idx_cv_user_updated ON cv(utilisateur_id, updated_at DESC);
```

---

## Monitoring et logs

### Frontend - Sentry (recommandé)

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

if (process.env.NEXT_PUBLIC_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENV,
    tracesSampleRate: 0.1,
  })
}
```

### Backend - Logs structurés

```java
// LoggingConfig.java
@Configuration
public class LoggingConfig {
    @Bean
    public Logger logger() {
        return LoggerFactory.getLogger("CvApplication");
    }
}
```

### Métriques à surveiller

| Métrique | Seuil | Action |
|----------|-------|--------|
| Temps de sauvegarde | > 1s | Optimiser API |
| Taille moyenne CV | > 1 MB | Avertir utilisateur |
| Erreurs 5xx | > 1% | Alerte équipe |
| Taux de succès save | < 95% | Investiguer |

---

## Sécurité

### Headers de sécurité

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ]
}
```

### Chiffrement localStorage (optionnel)

```typescript
// lib/utils/secureStorage.ts
import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY!

export function setSecure(key: string, value: any) {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    SECRET_KEY
  ).toString()
  localStorage.setItem(key, encrypted)
}

export function getSecure(key: string) {
  const encrypted = localStorage.getItem(key)
  if (!encrypted) return null
  
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
}
```

---

## Rollback en cas de problème

### Stratégie de rollback

1. **Identifier le problème**
   - Consulter les logs
   - Vérifier les métriques
   - Reproduire le bug

2. **Rollback frontend**
   ```bash
   # Vercel
   vercel rollback
   
   # Docker
   docker pull cv-app-frontend:previous-tag
   docker run -p 3000:3000 cv-app-frontend:previous-tag
   ```

3. **Rollback backend**
   ```bash
   # Redéployer la version précédente
   git checkout tags/v1.0.0
   mvn clean package
   java -jar target/backend.jar
   ```

4. **Rollback base de données**
   ```sql
   -- Restaurer depuis backup
   pg_restore -d cv_db backup_file.dump
   ```

---

## Post-déploiement

### Tests de validation

- [ ] Créer un CV de test
- [ ] Modifier et vérifier l'auto-save
- [ ] Recharger et vérifier le chargement
- [ ] Tester depuis mobile
- [ ] Tester depuis différents navigateurs
- [ ] Vérifier les performances (< 500ms)
- [ ] Vérifier les logs (pas d'erreurs)

### Communication

- [ ] Informer l'équipe du déploiement
- [ ] Documenter les changements
- [ ] Mettre à jour le changelog
- [ ] Former les utilisateurs si nécessaire

---

## Troubleshooting production

### Problème : Auto-save ne fonctionne pas

**Diagnostic :**
```bash
# Vérifier les logs frontend
# Dans la console navigateur

# Vérifier les logs backend
tail -f /var/log/backend/application.log

# Vérifier la connectivité API
curl -X GET https://api.example.com/cvs/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Solutions :**
1. Vérifier CORS
2. Vérifier JWT token
3. Vérifier la taille du payload
4. Vérifier les quotas localStorage

### Problème : Performance dégradée

**Diagnostic :**
```bash
# Analyser les requêtes lentes
# Dans PostgreSQL
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

**Solutions :**
1. Ajouter des index
2. Optimiser les requêtes
3. Mettre en cache
4. Utiliser CDN

---

## Maintenance

### Tâches hebdomadaires

- [ ] Vérifier les logs d'erreurs
- [ ] Vérifier les performances
- [ ] Vérifier l'espace disque
- [ ] Vérifier les backups

### Tâches mensuelles

- [ ] Mettre à jour les dépendances
- [ ] Analyser les métriques
- [ ] Optimiser si nécessaire
- [ ] Test de restauration backup

---

## Contact & Support

En cas de problème en production :

1. **Alertes critiques** : [email équipe]
2. **Documentation** : `/docs` dans le projet
3. **Runbook** : [lien vers runbook]
4. **On-call** : [planning d'astreinte]

---

**🎉 Déploiement réussi ! Le système d'auto-sauvegarde est maintenant en production.**
