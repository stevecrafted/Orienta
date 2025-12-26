import { apiClient } from './apiClient';

export interface Formation {
  id: string;
  titreFormation: string;
  isCertified: boolean;
  duration: string;
  isGratuit: string;
}

export const formationService = {
  getAllFormations: () => apiClient.get<Formation[]>('/formations'),
  
  getFormationById: (id: string) => apiClient.get<Formation>(`/formations/${id}`),
  
  getFormationsByGratuit: (isGratuit: string) => 
    apiClient.get<Formation[]>(`/formations/gratuit/${isGratuit}`),
  
  getFormationsByPoste: (posteId: number) => 
    apiClient.get<Formation[]>(`/formations/poste/${posteId}`),
  
  createFormation: (formation: Formation) => 
    apiClient.post<Formation>('/formations', formation),
  
  updateFormation: (id: string, formation: Formation) => 
    apiClient.put<Formation>(`/formations/${id}`, formation),
  
  deleteFormation: (id: string) => 
    apiClient.delete(`/formations/${id}`),
};
