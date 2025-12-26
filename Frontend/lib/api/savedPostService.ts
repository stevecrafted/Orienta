import { apiClient } from './apiClient'

export type SavedFormationPayload = {
  id: string
  titreFormation: string
  isCertified: boolean
  duration: string
  isGratuit: string
}

export const savedPostService = {
  createPostForUser: (utilisateurId: number, payload: { 
  description: string
    niveau?: string
    localisation?: string
  }) => apiClient.post(`/postes/utilisateur/${utilisateurId}`, payload),

  addFormationToPost: (posteId: number, formation: SavedFormationPayload) =>
    apiClient.post(`/postes/${posteId}/formations`, formation),
}
