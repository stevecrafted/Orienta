package com.example.backend.dto;

import java.util.List;

public class CvAnalysisRequest {
    private String cvText; 
    private String jobDescription;
    private String jobUrl;
    private List<String> currentSkills;
    private List<String> experiences;
    private List<String> educations;
    
    // Constructors
    public CvAnalysisRequest() {}
    
    public CvAnalysisRequest(String cvText, String jobDescription) {
        this.cvText = cvText; 
        this.jobDescription = jobDescription;
    }
    
    // Getters and Setters
    public String getCvText() {
        return cvText;
    }
    
    public void setCvText(String cvText) {
        this.cvText = cvText;
    }
     
    public String getJobDescription() {
        return jobDescription;
    }
    
    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
    
    public String getJobUrl() {
        return jobUrl;
    }
    
    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }
    
    public List<String> getCurrentSkills() {
        return currentSkills;
    }
    
    public void setCurrentSkills(List<String> currentSkills) {
        this.currentSkills = currentSkills;
    }
    
    public List<String> getExperiences() {
        return experiences;
    }
    
    public void setExperiences(List<String> experiences) {
        this.experiences = experiences;
    }
    
    public List<String> getEducations() {
        return educations;
    }
    
    public void setEducations(List<String> educations) {
        this.educations = educations;
    }
}
