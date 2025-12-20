package com.example.backend.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 * DTO pour la requête de recherche d'emploi
 */
public class JobResearchRequest {
    private MultipartFile cv;
    private String location;
    private Boolean includeRemote;
    private Integer maxResults;

    public JobResearchRequest() {
        this.location = "Antananarivo";
        this.includeRemote = true;
        this.maxResults = 10;
    }

    // Getters and Setters
    public MultipartFile getCv() { return cv; }
    public void setCv(MultipartFile cv) { this.cv = cv; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Boolean getIncludeRemote() { return includeRemote; }
    public void setIncludeRemote(Boolean includeRemote) { this.includeRemote = includeRemote; }

    public Integer getMaxResults() { return maxResults; }
    public void setMaxResults(Integer maxResults) { this.maxResults = maxResults; }
}
