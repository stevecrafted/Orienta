package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO pour la réponse de recherche d'emploi
 */
public class JobResearchResponse {
    private String googleQuery;
    private CvProfile extractedProfile;
    private List<JobResult> jobResults;
    private LocalDateTime searchTimestamp;

    public JobResearchResponse() {
        this.searchTimestamp = LocalDateTime.now();
    }

    public JobResearchResponse(String googleQuery, CvProfile extractedProfile, List<JobResult> jobResults) {
        this.googleQuery = googleQuery;
        this.extractedProfile = extractedProfile;
        this.jobResults = jobResults;
        this.searchTimestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public String getGoogleQuery() { return googleQuery; }
    public void setGoogleQuery(String googleQuery) { this.googleQuery = googleQuery; }

    public CvProfile getExtractedProfile() { return extractedProfile; }
    public void setExtractedProfile(CvProfile extractedProfile) { this.extractedProfile = extractedProfile; }

    public List<JobResult> getJobResults() { return jobResults; }
    public void setJobResults(List<JobResult> jobResults) { this.jobResults = jobResults; }

    public LocalDateTime getSearchTimestamp() { return searchTimestamp; }
    public void setSearchTimestamp(LocalDateTime searchTimestamp) { this.searchTimestamp = searchTimestamp; }
}
