package com.example.backend.dto;

import java.util.List;
import java.util.Map;

import com.example.backend.model.FormationRecommendation;

public class CvAnalysisResponse { 
    private String jobDescription;
    private List<String> missingSkills;
    private List<String> matchingSkills;
    private List<FormationRecommendation> recommendedFormations;
    private double matchPercentage;
    private Map<String, String> improvements;
    private String overallFeedback;
    
    // Constructors
    public CvAnalysisResponse() {} 
    
    public String getJobDescription() {
        return jobDescription;
    }
    
    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }
    
    public List<String> getMissingSkills() {
        return missingSkills;
    }
    
    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
    
    public List<String> getMatchingSkills() {
        return matchingSkills;
    }
    
    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }
    
    public List<FormationRecommendation> getRecommendedFormations() {
        return recommendedFormations;
    }
    
    public void setRecommendedFormations(List<FormationRecommendation> recommendedFormations) {
        this.recommendedFormations = recommendedFormations;
    }
    
    public double getMatchPercentage() {
        return matchPercentage;
    }
    
    public void setMatchPercentage(double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }
    
    public Map<String, String> getImprovements() {
        return improvements;
    }
    
    public void setImprovements(Map<String, String> improvements) {
        this.improvements = improvements;
    }
    
    public String getOverallFeedback() {
        return overallFeedback;
    }
    
    public void setOverallFeedback(String overallFeedback) {
        this.overallFeedback = overallFeedback;
    }
    
}
