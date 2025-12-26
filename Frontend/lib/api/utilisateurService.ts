import { apiClient } from './apiClient';

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  lotAddresse: string;
}

export const utilisateurService = {
  getAllUtilisateurs: () => apiClient.get<Utilisateur[]>('/utilisateurs'),
  
  getUtilisateurById: (id: number) => apiClient.get<Utilisateur>(`/utilisateurs/${id}`),
  
  getUtilisateurByEmail: (email: string) => 
    apiClient.get<Utilisateur>(`/utilisateurs/email/${email}`),
  
  createUtilisateur: (utilisateur: Utilisateur) => 
    apiClient.post<Utilisateur>('/utilisateurs', utilisateur),
  
  updateUtilisateur: (id: number, utilisateur: Utilisateur) => 
    apiClient.put<Utilisateur>(`/utilisateurs/${id}`, utilisateur),
  
  deleteUtilisateur: (id: number) => 
    apiClient.delete(`/utilisateurs/${id}`),
};
