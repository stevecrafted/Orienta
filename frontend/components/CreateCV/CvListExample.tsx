"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cvService, type Cv } from '@/lib/api/cvService';
import { FileText, Edit, Trash2, Plus, Loader2 } from 'lucide-react';

/**
 * Exemple de composant pour afficher la liste des CV d'un utilisateur
 * avec possibilité de créer, éditer et supprimer des CV
 */
export default function CvListExample() {
  const router = useRouter();
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
        loadCvs(user.id);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        setError('Erreur d\'authentification');
        setIsLoading(false);
      }
    } else {
      setError('Utilisateur non connecté');
      setIsLoading(false);
    }
  }, []);

  const loadCvs = async (utilisateurId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cvService.getCvsByUtilisateur(utilisateurId);
      setCvs(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des CV:', err);
      setError('Erreur lors du chargement des CV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Rediriger vers la page de création
    router.push('/CreateCv');
  };

  const handleEdit = (cvId: number) => {
    // Rediriger vers la page d'édition avec l'ID du CV
    router.push(`/CreateCv?cvId=${cvId}`);
  };

  const handleDelete = async (cvId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      return;
    }

    try {
      await cvService.deleteCv(cvId);
      // Recharger la liste
      if (userId) {
        loadCvs(userId);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression du CV');
    }
  };

  const getCvPreview = (cv: Cv): string => {
    try {
      const data = JSON.parse(cv.descriptionCv);
      return data.resume?.header?.name || 'CV sans nom';
    } catch {
      return 'CV';
    }
  };

  const getCvDate = (cv: Cv): string => {
    try {
      const data = JSON.parse(cv.descriptionCv);
      if (data.timestamp) {
        return new Date(data.timestamp).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch {}
    return 'Date inconnue';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Chargement des CV...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-semibold">Erreur</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mon Cv</h2>
          <p className="text-gray-600 mt-1">
            {cvs.length} CV{cvs.length !== 1 ? 's' : ''} créé{cvs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer un nouveau CV
        </button>
      </div>

      {/* Liste des CV */}
      {cvs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Aucun CV pour le moment
          </h3>
          <p className="text-gray-600 mb-6">
            Créez votre premier CV avec notre éditeur en ligne
          </p>
          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Commencer maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div
              key={cv.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <FileText className="w-20 h-20 text-blue-400" />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {getCvPreview(cv)}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Modifié: {getCvDate(cv)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => cv.id && handleEdit(cv.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Éditer
                  </button>
                  <button
                    onClick={() => cv.id && handleDelete(cv.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
