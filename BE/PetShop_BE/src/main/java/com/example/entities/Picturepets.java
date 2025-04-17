package com.example.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "picturepets")
public class Picturepets {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "image")
    private String image;

    @Column(name = "petId")
    private Integer petId;

    @Column(name = "created")
    private LocalDate created;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Integer getPetId() {
        return this.petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public LocalDate getCreated() {
        return this.created;
    }

    public void setCreated(LocalDate created) {
        this.created = created;
    }
}
