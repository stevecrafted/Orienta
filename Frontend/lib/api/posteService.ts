import { apiClient } from './apiClient';

export interface Poste {
  id?: number; 
  description: string;
  entreprise: string;
  niveau: string;
  localisation: string;
  responsabilite: string;
  competence: string;
}

export interface Formation {
  id: string;
  titreFormation: string;
  isCertified: boolean;
  duration: string;
  isGratuit: string;
}

export const posteService = {
  // Poste operations
  getAllPostes: () => apiClient.get<Poste[]>('/postes'),
  
  getPosteById: (id: number) => apiClient.get<Poste>(`/postes/${id}`),
  
  getPostesByUtilisateur: (utilisateurId: number) => 
    apiClient.get<Poste[]>(`/postes/utilisateur/${utilisateurId}`),
  
  searchPostes: (keyword: string) => 
    apiClient.get<Poste[]>(`/postes/search?keyword=${encodeURIComponent(keyword)}`),
  
  getPostesByNiveau: (niveau: string) => 
    apiClient.get<Poste[]>(`/postes/niveau/${niveau}`),
  
  getPostesByLocalisation: (localisation: string) => 
    apiClient.get<Poste[]>(`/postes/localisation/${encodeURIComponent(localisation)}`),
  
  createPoste: (utilisateurId: number, poste: Poste) => 
    apiClient.post<Poste>(`/postes/utilisateur/${utilisateurId}`, poste),
  
  updatePoste: (id: number, poste: Poste) => 
    apiClient.put<Poste>(`/postes/${id}`, poste),
  
  deletePoste: (id: number) => 
    apiClient.delete(`/postes/${id}`),
  
  getFormationsByPoste: (posteId: number) => 
    apiClient.get<Formation[]>(`/postes/${posteId}/formations`),
};
