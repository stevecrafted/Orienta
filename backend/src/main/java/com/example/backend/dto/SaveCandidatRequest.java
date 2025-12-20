package com.example.backend.dto;

public class SaveCandidatRequest {
    private Long recruteurId;
    private String notes;

    public SaveCandidatRequest() {
    }

    public SaveCandidatRequest(Long recruteurId, String notes) {
        this.recruteurId = recruteurId;
        this.notes = notes;
    }

    public Long getRecruteurId() {
        return recruteurId;
    }

    public void setRecruteurId(Long recruteurId) {
        this.recruteurId = recruteurId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
