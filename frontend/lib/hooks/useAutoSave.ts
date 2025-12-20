import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { cvService } from '@/lib/api/cvService';
import { 
  modernToBackend, 
  backendToModern, 
  cleanCvData,
  getCvSize,
  type ModernCvData 
} from '@/lib/utils/cvMigration';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  delay?: number;
  enabled?: boolean;
  cvId?: number;
  utilisateurId?: number;
  onSave?: () => void;
  onError?: (error: any) => void;
}

export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const {
    delay = 5000,
    enabled = true,
    cvId,
    utilisateurId,
    onSave,
    onError,
  } = options;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Récupérer l'état du CV depuis Redux
  const resumeState = useSelector((state: RootState) => state.resume);
  const settingsState = useSelector((state: RootState) => state.settings);
  
  // Références pour le debounce et la dernière sauvegarde
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>('');
  const isMountedRef = useRef(true);
  const saveInProgressRef = useRef(false);

  // Fonction pour convertir l'état Redux en format JSON
  const serializeState = useCallback(() => {
    try {
      const data: ModernCvData = {
        resume: resumeState,
        settings: settingsState,
        timestamp: new Date().toISOString(),
      };
      const cleaned = cleanCvData(data);
      return JSON.stringify(cleaned);
    } catch (error) {
      console.error('Erreur lors de la sérialisation:', error);
      return '';
    }
  }, [resumeState, settingsState]);

  // Fonction pour sauvegarder dans localStorage
  const saveToLocalStorage = useCallback((data: string) => {
    try {
      const key = cvId ? `cv-${cvId}` : 'cv-draft';
      localStorage.setItem(key, data);
      localStorage.setItem(`${key}-timestamp`, new Date().toISOString());
      console.log(`💾 localStorage sauvegardé: ${key}`);
    } catch (error) {
      console.error('❌ Erreur localStorage:', error);
      throw error;
    }
  }, [cvId]);

  // Fonction principale de sauvegarde avec useCallback
  const save = useCallback(async () => {
    if (!enabled || !isMountedRef.current || saveInProgressRef.current) {
      console.log('⏸️ Sauvegarde ignorée:', { enabled, mounted: isMountedRef.current, inProgress: saveInProgressRef.current });
      return;
    }

    const currentState = serializeState();
    
    // Ne rien faire si l'état n'a pas changé
    if (!currentState || currentState === lastSavedStateRef.current) {
      console.log('⏭️ Aucun changement détecté');
      return;
    }

    console.log('🔄 Début de sauvegarde...');
    saveInProgressRef.current = true;
    setSaveStatus('saving');

    try {
      // 1. Sauvegarder dans localStorage d'abord (plus rapide)
      saveToLocalStorage(currentState);

      // 2. Préparer les données pour l'API
      const modernData: ModernCvData = {
        resume: resumeState,
        settings: settingsState,
        timestamp: new Date().toISOString(),
      };
      
      const cleanedData = cleanCvData(modernData);
      const backendData = modernToBackend(cleanedData);
      const cvData = {
        descriptionCv: JSON.stringify(backendData),
      } as any;

      // 3. Sauvegarder dans le backend
      if (cvId) {
        console.log(`📤 Mise à jour CV #${cvId}...`);
        await cvService.updateCv(cvId, cvData);
        console.log(`✅ CV #${cvId} mis à jour`);
      } else if (utilisateurId) {
        console.log(`📤 Création nouveau CV pour user #${utilisateurId}...`);
        const response = await cvService.createCv(utilisateurId, cvData);
        console.log(`✅ CV créé avec ID: ${(response.data as any)?.id}`);
        // TODO: Vous pourriez vouloir mettre à jour l'URL avec le nouvel ID
      } else {
        console.log('💾 Sauvegarde locale uniquement (pas d\'ID utilisateur)');
      }

      // 4. Mise à jour des références
      lastSavedStateRef.current = currentState;
      setLastSaved(new Date());
      setSaveStatus('saved');

      if (onSave) {
        onSave();
      }

      // Retour à 'idle' après 2 secondes
      setTimeout(() => {
        if (isMountedRef.current) {
          setSaveStatus('idle');
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
      
      if (onError) {
        onError(error);
      }

      // Retour à 'idle' après 3 secondes
      setTimeout(() => {
        if (isMountedRef.current) {
          setSaveStatus('idle');
        }
      }, 3000);
    } finally {
      saveInProgressRef.current = false;
    }
  }, [
    enabled,
    serializeState,
    saveToLocalStorage,
    resumeState,
    settingsState,
    cvId,
    utilisateurId,
    onSave,
    onError
  ]);

  // Fonction pour forcer une sauvegarde immédiate
  const forceSave = useCallback(() => {
    console.log('🔥 Sauvegarde forcée');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    save();
  }, [save]);

  // Effet pour détecter les changements et déclencher l'auto-save
  useEffect(() => {
    if (!enabled) {
      console.log('⏸️ Auto-save désactivé');
      return;
    }

    const currentState = serializeState();
    
    // Ne rien faire si l'état n'a pas changé
    if (!currentState || currentState === lastSavedStateRef.current) {
      return;
    }

    console.log(`⏰ Changement détecté, sauvegarde dans ${delay}ms...`);

    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Créer un nouveau timeout pour la sauvegarde
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    // Nettoyage
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, delay, serializeState, save]);

  // Effet de nettoyage au démontage
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      console.log('🧹 Nettoyage du hook auto-save');
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Log initial pour debug
  useEffect(() => {
    console.log('🚀 Hook auto-save initialisé:', {
      enabled,
      delay,
      cvId,
      utilisateurId,
      hasResumeState: !!resumeState,
      hasSettingsState: !!settingsState
    });
  }, []);

  return {
    saveStatus,
    lastSaved,
    forceSave,
  };
}

// Hook pour charger un CV depuis localStorage ou l'API
export function useLoadCv(cvId?: number) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const key = cvId ? `cv-${cvId}` : 'cv-draft';
      const data = localStorage.getItem(key);
      
      if (data) {
        console.log(`📂 Chargé depuis localStorage: ${key}`);
        return JSON.parse(data);
      }
      
      console.log(`📭 Aucune donnée dans localStorage: ${key}`);
      return null;
    } catch (error) {
      console.error('❌ Erreur localStorage:', error);
      return null;
    }
  }, [cvId]);

  const loadFromApi = useCallback(async () => {
    if (!cvId) {
      console.log('⏭️ Pas de cvId, chargement API ignoré');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📥 Chargement CV #${cvId} depuis l'API...`);
      const response = await cvService.getCvById(cvId);
      
      if (response.data?.descriptionCv) {
        const modernData = backendToModern(response.data.descriptionCv as any);
        if (modernData) {
          const size = getCvSize(modernData);
          console.log(`✅ CV #${cvId} chargé (${size} KB)`);
          return modernData;
        }
      }
      
      console.log(`⚠️ CV #${cvId} sans données`);
      return null;
    } catch (err) {
      console.error('❌ Erreur API:', err);
      setError('Erreur lors du chargement du CV');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cvId]);

  return {
    loadFromLocalStorage,
    loadFromApi,
    isLoading,
    error,
  };
}