/**
 * Utilitaires de migration pour les CV
 * Permet de convertir les anciens formats vers le nouveau format avec auto-sauvegarde
 */

import type { ResumeState } from '@/lib/types';
import type { SettingsState } from '@/lib/types';

export interface LegacyCvData {
  descriptionCv: string;
  id?: number;
  utilisateur?: any;
}

export interface ModernCvData {
  resume: ResumeState;
  settings: SettingsState;
  timestamp: string;
}

export interface BackendCvData {
  resume: ResumeState;
  settings: SettingsState;
  timestamp: string;
  version?: number;
}

/**
 * Vérifie si les données sont au nouveau format
 */
export function isModernFormat(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    'resume' in data &&
    'settings' in data &&
    'timestamp' in data
  );
}

/**
 * Convertit les données modernes vers le format backend
 */
export function modernToBackend(data: ModernCvData): BackendCvData {
  return {
    resume: data.resume,
    settings: data.settings,
    timestamp: data.timestamp,
  };
}

/**
 * Vérifie si les données sont à l'ancien format
 */
export function isLegacyFormat(data: any): boolean {
  return (
    data &&
    typeof data === 'string' &&
    data.trim().length > 0
  );
}

/**
 * Migre un CV de l'ancien format vers le nouveau format
 * 
 * @param legacyData - Données au format legacy (string ou objet)
 * @returns Données au nouveau format ou null si impossible
 */
export function migrateLegacyToModern(legacyData: any): ModernCvData | null {
  try {
    // Si c'est déjà au nouveau format
    if (isModernFormat(legacyData)) {
      return legacyData as ModernCvData;
    }

    // Si c'est un string, le parser
    let parsedData = legacyData;
    if (typeof legacyData === 'string') {
      parsedData = JSON.parse(legacyData);
    }

    // Si après parsing c'est au nouveau format
    if (isModernFormat(parsedData)) {
      return parsedData as ModernCvData;
    }

    // Sinon, créer une structure moderne avec les données disponibles
    console.warn('Format de CV non reconnu, création d\'une structure par défaut');

    return {
      resume: parsedData.resume || getDefaultResumeState(),
      settings: parsedData.settings || getDefaultSettingsState(),
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Erreur lors de la migration du CV:', error);
    return null;
  }
}


/**
 * Convertit les données backend vers le format moderne
 */
export function backendToModern(data: any): ModernCvData | null {
  try {
    // Si c'est déjà un objet
    if (typeof data === 'object' && data !== null) {
      return {
        resume: data.resume || getDefaultResumeState(),
        settings: data.settings || getDefaultSettingsState(),
        timestamp: data.timestamp || new Date().toISOString(),
      };
    }

    // Si c'est une chaîne JSON
    if (typeof data === 'string') {
      const parsed = JSON.parse(data);
      return backendToModern(parsed);
    }

    console.warn('Format de données non reconnu');
    return null;
  } catch (error) {
    console.error('Erreur lors de la conversion backend vers moderne:', error);
    return null;
  }
}

/**
 * État par défaut pour resume (en cas de migration échouée)
 */
function getDefaultResumeState(): ResumeState {
  return {
    header: {
      name: "VOTRE NOM",
      title: "Votre titre professionnel",
      phone: "Téléphone",
      email: "Email",
      link: "LinkedIn/Portfolio",
      extraLink: "Lien supplémentaire",
      location: "Localisation",
      extraField: "Champ supplémentaire",
      photoUrl: "",
      visibility: {
        title: true,
        phone: true,
        email: true,
        link: true,
        extraLink: true,
        location: true,
        photo: true,
        extraField: true,
      },
      uppercaseName: true,
      roundPhoto: true,
    },
    sections: [],
    activeSection: null,
    activeSkillData: {
      sectionId: "",
      groupId: "",
      skillIndex: 0,
    },
    history: {
      past: [],
      future: [],
    },
  };
}

/**
 * État par défaut pour settings
 */
function getDefaultSettingsState(): SettingsState {
  return {
    branding: true,
    theme: "light",
    fontSize: 1,
    fontFamily: "Inter",
    template: "double-column",
    showTemplatesModal: false,
    showAddSectionModal: false,
    addSectionColumn: "left",
  };
}

// ============================================
// COMPRESSION (optionnel)
// ============================================

/**
 * Compresse les données du CV pour réduire la taille
 */
export function compressCvData(data: ModernCvData): string {
  try {
    const jsonString = JSON.stringify(data);
    // Utiliser LZ-string ou similaire pour la compression
    // Pour l'instant, on retourne juste le JSON
    return jsonString;
  } catch (error) {
    console.error('Erreur lors de la compression:', error);
    return '';
  }
}

/**
 * Valide que les données sont complètes et valides
 */
export function validateCvData(data: ModernCvData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Vérifier resume
  if (!data.resume) {
    errors.push('resume manquant');
  } else {
    if (!data.resume.header) {
      errors.push('resume.header manquant');
    }
    if (!Array.isArray(data.resume.sections)) {
      errors.push('resume.sections doit être un tableau');
    }
  }

  // Vérifier settings
  if (!data.settings) {
    errors.push('settings manquant');
  } else {
    if (!data.settings.template) {
      errors.push('settings.template manquant');
    }
  }

  // Vérifier timestamp
  if (!data.timestamp) {
    errors.push('timestamp manquant');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Nettoie les données du CV avant sauvegarde
 * - Supprime les champs temporaires
 * - Supprime l'historique (trop volumineux)
 * - Valide la structure
 */
export function cleanCvData(data: ModernCvData): ModernCvData {
  const cleaned: ModernCvData = {
    resume: {
      ...data.resume,
      // Supprimer l'historique (past/future) - trop volumineux
      history: {
        past: [],
        future: [],
      },
      // Garder activeSection mais le nettoyer
      activeSection: null,
      activeSkillData: null,
    },
    settings: { ...data.settings },
    timestamp: new Date().toISOString(),
  };

  return cleaned;
}

/**
 * Compare deux états de CV pour détecter les changements
 */
export function hasChanges(oldData: ModernCvData, newData: ModernCvData): boolean {
  // Nettoyer les deux avant comparaison
  const cleanedOld = cleanCvData(oldData);
  const cleanedNew = cleanCvData(newData);

  // Comparer les strings JSON
  return JSON.stringify(cleanedOld) !== JSON.stringify(cleanedNew);
}

/**
 * Obtient un résumé lisible du CV pour l'affichage
 */
export function getCvSummary(data: ModernCvData): {
  name: string;
  title: string;
  sectionsCount: number;
  lastModified: string;
  template: string;
} {
  return {
    name: data.resume?.header?.name || 'Sans nom',
    title: data.resume?.header?.title || 'Sans titre',
    sectionsCount: data.resume?.sections?.length || 0,
    lastModified: data.timestamp
      ? new Date(data.timestamp).toLocaleString('fr-FR')
      : 'Jamais',
    template: data.settings?.template || 'double-column',
  };
}


/**
 * Crée un résumé du CV pour l'affichage
 */
export function createCvSummary(data: ModernCvData): {
  name: string;
  sections: number;
  template: string;
  lastModified: string;
  size: string;
} {
  return {
    name: data.resume.header.name,
    sections: data.resume.sections.length,
    template: data.settings.template,
    lastModified: data.timestamp,
    size: getCvSize(data) + ' KB',
  };
}


/**
 * Compare deux CV et retourne les différences
 */
export function compareCvs(cv1: ModernCvData, cv2: ModernCvData): string[] {
  const differences: string[] = [];
  
  // Comparer les headers
  if (cv1.resume.header.name !== cv2.resume.header.name) {
    differences.push('Nom différent');
  }
  
  // Comparer le nombre de sections
  if (cv1.resume.sections.length !== cv2.resume.sections.length) {
    differences.push(`Nombre de sections différent (${cv1.resume.sections.length} vs ${cv2.resume.sections.length})`);
  }
  
  // Comparer les templates
  if (cv1.settings.template !== cv2.settings.template) {
    differences.push(`Template différent (${cv1.settings.template} vs ${cv2.settings.template})`);
  }
  
  return differences;
}

/**
 * Exporte le CV au format JSON téléchargeable
 */
export function exportCvToJson(data: ModernCvData, filename?: string): void {
  const cleaned = cleanCvData(data);
  const json = JSON.stringify(cleaned, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `cv-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Importe un CV depuis un fichier JSON
 */
export async function importCvFromJson(file: File): Promise<ModernCvData | null> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Valider les données
    const validation = validateCvData(data);
    if (!validation.valid) {
      console.error('Données invalides:', validation.errors);
      return null;
    }

    // Migrer si nécessaire
    const modernData = migrateLegacyToModern(data);
    return modernData;
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return null;
  }
}

/**
 * Calcule la taille du CV en Ko
 */
export function getCvSize(data: ModernCvData): number {
  const json = JSON.stringify(data);
  const bytes = new Blob([json]).size;
  return Math.round(bytes / 1024 * 100) / 100; // Arrondi à 2 décimales
}
