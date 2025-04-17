package com.example.dtos;

import java.time.LocalDate;

public class PicturepetsDTO {
    private Integer id;
    private String image;
    private Integer petId;
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
