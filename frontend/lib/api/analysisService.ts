import { apiClient } from './apiClient';

export interface CvAnalysisRequest {
  cvText: string; 
  jobDescription: string;
  jobUrl?: string;
  currentSkills?: string[];
  experiences?: string[];
  educations?: string[];
}

export interface FormationRecommendation {
  id: string;
  titre: string;
  duration: string;
  isCertified: boolean;
  isGratuit: boolean;
  relevanceReason: string;
  url?: string;
  plateforme?: string;
  certificatType?: string;
  modalite?: string;
  targetedSkills?: string[];
}

export interface CvAnalysisResponse { 
  jobDescription: string;
  missingSkills: string[];
  matchingSkills: string[];
  recommendedFormations: FormationRecommendation[];
  matchPercentage: number;
  improvements: Record<string, string>;
  overallFeedback: string;
}

export const analysisService = {
  analyzeCv: (request: CvAnalysisRequest) => 
    apiClient.post<CvAnalysisResponse>('/analysis/cv', request),
  
  analyzeCvWithFile: (file: File,  jobDescription: string) => 
    apiClient.uploadFile<CvAnalysisResponse>(
      '/analysis/cv/upload',
      file,
      { jobDescription }
    ),
  
  analyzeCvWithUrl: (request: CvAnalysisRequest) => 
    apiClient.post<CvAnalysisResponse>('/analysis/cv/url', request),
};
