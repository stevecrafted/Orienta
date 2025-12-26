import { apiClient } from './apiClient';

/**
 * Types pour la recherche d'emploi
 */

export interface CvProfile {
  name: string;
  title: string;
  skills: string[];
  experience: string;
  education: string;
  yearsOfExperience?: number;
  location?: string;
}

export interface JobResult {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  isRemote: boolean;
  publishedDate?: string;
}

export interface JobResearchResponse {
  googleQuery: string;
  extractedProfile: CvProfile;
  jobResults: JobResult[];
  searchTimestamp: string;
}

/**
 * Service pour la recherche d'emploi basée sur un CV
 */
export const jobResearchService = {
  /**
   * Analyse un CV et recherche des offres d'emploi correspondantes
   */
  async analyzeAndSearchJobs(
    cv: File,
    location: string = 'Antananarivo',
    includeRemote: boolean = true
  ): Promise<JobResearchResponse> {
    const response = await apiClient.uploadFile<JobResearchResponse>(
      '/job-research/analyze',
      cv,
      {
        location,
        includeRemote: String(includeRemote),
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data!;
  },

  /**
   * Teste la santé du service
   */
  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await apiClient.get<{ status: string; service: string }>('/job-research/health');
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data || { status: 'unknown', service: 'job-research' };
  },
};

export default jobResearchService;
