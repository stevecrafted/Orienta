"use client"

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/store';
import { Info, Database, HardDrive, Clock } from 'lucide-react';

/**
 * Panneau de débogage pour l'auto-sauvegarde
 * Affiche l'état actuel, localStorage, et permet de tester manuellement
 * 
 * Usage: Ajouter ce composant dans resume-builder.tsx pour le développement
 * <AutoSaveDebugPanel />
 */
export default function AutoSaveDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const resumeState = useSelector((state: RootState) => state.resume);
  const settingsState = useSelector((state: RootState) => state.settings);

  const getLocalStorageInfo = () => {
    try {
      const draft = localStorage.getItem('cv-draft');
      const timestamp = localStorage.getItem('cv-draft-timestamp');
      
      if (!draft) return null;

      const data = JSON.parse(draft);
      const size = new Blob([draft]).size;
      const sizeKB = (size / 1024).toFixed(2);

      return {
        size: `${sizeKB} KB`,
        timestamp: timestamp ? new Date(timestamp).toLocaleString('fr-FR') : 'N/A',
        hasData: true,
        sectionsCount: data.resume?.sections?.length || 0,
        headerName: data.resume?.header?.name || 'N/A',
      };
    } catch (error) {
      return { error: 'Erreur de lecture' };
    }
  };

  const clearLocalStorage = () => {
    if (confirm('Voulez-vous vraiment vider le localStorage ?')) {
      localStorage.removeItem('cv-draft');
      localStorage.removeItem('cv-draft-timestamp');
      alert('localStorage vidé !');
      window.location.reload();
    }
  };

  const downloadState = () => {
    const data = {
      resume: resumeState,
      settings: settingsState,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-state-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const localStorageInfo = getLocalStorageInfo();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 z-50"
        title="Ouvrir le panneau de débogage"
      >
        <Info className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          <h3 className="font-semibold">Debug Auto-Save</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-purple-700 rounded px-2 py-1"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {/* Redux State */}
        <div className="bg-blue-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Redux State</h4>
          </div>
          <div className="text-sm space-y-1">
            <p><strong>Nom:</strong> {resumeState.header.name}</p>
            <p><strong>Email:</strong> {resumeState.header.email}</p>
            <p><strong>Sections:</strong> {resumeState.sections.length}</p>
            <p><strong>Template:</strong> {settingsState.template}</p>
          </div>
        </div>

        {/* localStorage */}
        <div className="bg-green-50 p-3 rounded">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-green-900">localStorage</h4>
          </div>
          {localStorageInfo?.hasData ? (
            <div className="text-sm space-y-1">
              <p><strong>Taille:</strong> {localStorageInfo.size}</p>
              <p><strong>Nom:</strong> {localStorageInfo.headerName}</p>
              <p><strong>Sections:</strong> {localStorageInfo.sectionsCount}</p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <strong>Dernière sauvegarde:</strong>
              </p>
              <p className="text-xs">{localStorageInfo.timestamp}</p>
            </div>
          ) : localStorageInfo?.error ? (
            <p className="text-sm text-red-600">{localStorageInfo.error}</p>
          ) : (
            <p className="text-sm text-gray-600">Aucune donnée</p>
          )}
        </div>

        {/* Stats */}
        <div className="bg-gray-50 p-3 rounded">
          <h4 className="font-semibold text-gray-900 mb-2">Statistiques</h4>
          <div className="text-sm space-y-1">
            <p><strong>Historique (past):</strong> {resumeState.history.past.length}</p>
            <p><strong>Historique (future):</strong> {resumeState.history.future.length}</p>
            <p><strong>Section active:</strong> {resumeState.activeSection?.id || 'Aucune'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={downloadState}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            📥 Télécharger l'état JSON
          </button>
          <button
            onClick={clearLocalStorage}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            🗑️ Vider localStorage
          </button>
          <button
            onClick={() => {
              console.log('Redux State:', { resume: resumeState, settings: settingsState });
              console.log('localStorage:', localStorage.getItem('cv-draft'));
            }}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            🖨️ Log dans console
          </button>
        </div>

        {/* Info */}
        <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
          <strong>💡 Astuce:</strong> Ce panneau est visible uniquement en développement. 
          Retirez-le avant la production.
        </div>
      </div>
    </div>
  );
  
}
