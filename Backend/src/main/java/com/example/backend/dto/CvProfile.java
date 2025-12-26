package com.example.backend.dto;

import java.util.List;

/**
 * DTO représentant le profil extrait d'un CV
 */
public class CvProfile {
    private String name;
    private String title;
    private List<String> skills;
    private String experience;
    private String education;
    private Integer yearsOfExperience;
    private String location;

    public CvProfile() {}

    public CvProfile(String name, String title, List<String> skills, String experience, String education, Integer yearsOfExperience, String location) {
        this.name = name;
        this.title = title;
        this.skills = skills;
        this.experience = experience;
        this.education = education;
        this.yearsOfExperience = yearsOfExperience;
        this.location = location;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
