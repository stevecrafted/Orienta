package com.example.backend.dto;

/**
 * DTO représentant un résultat de recherche d'emploi
 */
public class JobResult {
    private String title;
    private String company;
    private String location;
    private String url;
    private String description;
    private Boolean isRemote;
    private String publishedDate;

    public JobResult() {}

    public JobResult(String title, String company, String location, String url, String description, Boolean isRemote, String publishedDate) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.url = url;
        this.description = description;
        this.isRemote = isRemote;
        this.publishedDate = publishedDate;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsRemote() { return isRemote; }
    public void setIsRemote(Boolean isRemote) { this.isRemote = isRemote; }

    public String getPublishedDate() { return publishedDate; }
    public void setPublishedDate(String publishedDate) { this.publishedDate = publishedDate; }
}
