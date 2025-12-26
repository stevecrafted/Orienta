import { apiClient } from './apiClient';


export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  lotAddresse: string;
}

export interface Cv {
  id?: number;
  descriptionCv: string;
  utilisateur?: Utilisateur;
}

export interface ExperienceCv {
  id?: number;
  daty: string;
  titreExperience: string;
  placeExperience: string;
}

export interface EducationCv {
  id?: number;
  titreEducation: string;
  dateEducation: string;
  placeEducation: string;
}

export interface Skills {
  id: string;
  nom: string;
}

export const cvService = {
  // CV operations
  getAllCvs: () => apiClient.get<Cv[]>('/cvs'),
  
  getCvById: (id: number) => apiClient.get<Cv>(`/cvs/${id}`),
  
  getCvsByUtilisateur: (utilisateurId: number) => 
    apiClient.get<Cv[]>(`/cvs/utilisateur/${utilisateurId}`),
  
  createCv: (utilisateurId: number, cv: Cv) => 
    apiClient.post<Cv>(`/cvs/utilisateur/${utilisateurId}`, cv),
  
  updateCv: (id: number, cv: Cv) => 
    apiClient.put<Cv>(`/cvs/${id}`, cv),
  
  deleteCv: (id: number) => 
    apiClient.delete(`/cvs/${id}`),

  // Experience operations
  addExperience: (cvId: number, experience: ExperienceCv) => 
    apiClient.post<ExperienceCv>(`/cvs/${cvId}/experiences`, experience),
  
  getExperiences: (cvId: number) => 
    apiClient.get<ExperienceCv[]>(`/cvs/${cvId}/experiences`),
  
  deleteExperience: (experienceId: number) => 
    apiClient.delete(`/cvs/experiences/${experienceId}`),

  // Education operations
  addEducation: (cvId: number, education: EducationCv) => 
    apiClient.post<EducationCv>(`/cvs/${cvId}/educations`, education),
  
  getEducations: (cvId: number) => 
    apiClient.get<EducationCv[]>(`/cvs/${cvId}/educations`),
  
  deleteEducation: (educationId: number) => 
    apiClient.delete(`/cvs/educations/${educationId}`),

  // Skills operations
  addSkill: (cvId: number, skill: Skills) => 
    apiClient.post<Skills>(`/cvs/${cvId}/skills`, skill),
  
  getSkills: (cvId: number) => 
    apiClient.get<Skills[]>(`/cvs/${cvId}/skills`),
  
  deleteSkill: (skillId: string) => 
    apiClient.delete(`/cvs/skills/${skillId}`),

  // CV Modele operations
  getCvModeleById: (id: number) => 
    apiClient.get<any>(`/cv-modeles/${id}`),
  
  createCvModele: (cvModele: any) => 
    apiClient.post<any>(`/cv-modeles`, cvModele),
  
  updateCvModele: (id: number, cvModele: any) => 
    apiClient.put<any>(`/cv-modeles/${id}`, cvModele),
};
