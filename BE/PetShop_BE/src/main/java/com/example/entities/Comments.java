package com.example.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comments {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "userId")
    private Integer userId;

    @Column(name = "petId")
    private Integer petId;

    @Column(name = "note")
    private String note;

    @Column(name = "createDate")
    private LocalDateTime createDate;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getPetId() {
        return this.petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreateDate() {
        return this.createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
}
