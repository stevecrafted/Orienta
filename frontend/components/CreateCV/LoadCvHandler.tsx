"use client"

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { loadResumeState } from '@/lib/features/resume/resumeSlice';
import { loadSettingsState } from '@/lib/features/settings/settingsSlice';
import { useLoadCv } from '@/lib/hooks/useAutoSave';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react';

const HtmlLoaderClient = dynamic(() => import('@/components/Loading/HtmlLoader'), { ssr: false });

interface LoadCvHandlerProps {
  cvId?: number;
  children: React.ReactNode;
}

export default function LoadCvHandler({ cvId, children }: LoadCvHandlerProps) {
  const dispatch = useDispatch();
  const { loadFromApi, loadFromLocalStorage, isLoading, error } = useLoadCv(cvId);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadCvData = async () => {
      try {
        let data = null;

        if (cvId) {
          // Cas 1: Charger depuis l'API si cvId est fourni
          console.log('Chargement du CV depuis l\'API, ID:', cvId);
          data = await loadFromApi();
          
          // Fallback sur localStorage si l'API échoue
          if (!data) {
            console.log('Échec de l\'API, tentative depuis localStorage');
            data = loadFromLocalStorage();
          }
        } else {
          // Cas 2: Charger depuis localStorage (brouillon)
          console.log('Chargement du brouillon depuis localStorage');
          data = loadFromLocalStorage();
        }

        // Charger les données dans Redux
        if (data) {
          if (data.resume) {
            dispatch(loadResumeState(data.resume));
            console.log('État du CV chargé dans Redux');
          }
          if (data.settings) {
            dispatch(loadSettingsState(data.settings));
            console.log('Paramètres chargés dans Redux');
          }
        } else {
          console.log('Aucune donnée à charger, utilisation de l\'état par défaut');
        }

        setIsInitialized(true);
      } catch (err) {
        console.error('Erreur lors du chargement du CV:', err);
        setIsInitialized(true); // Continuer avec l'état par défaut
      }
    };

    loadCvData();
  }, [cvId, dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#fafbfd]">
        {/* full-screen loader injected from public/loading/loading.html */}
        <div className="flex items-center justify-center w-full h-full">
          <div style={{ width: 300 }}>
            {/* HtmlLoader is dynamically imported to avoid SSR issues */}
            <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" /></div>}>
              {/* @ts-ignore */}
              <HtmlLoaderClient />
            </React.Suspense>
          </div>
        </div>
      </div>
    );
  }

  if (error && cvId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#fafbfd]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Erreur de chargement</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
