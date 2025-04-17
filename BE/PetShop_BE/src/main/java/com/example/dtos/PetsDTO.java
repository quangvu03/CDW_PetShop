package com.example.dtos;

import java.time.LocalDate;

public class PetsDTO {
    private Integer id;
    private String petName;
    private String petType;
    private String petGender;
    private String description;
    private String detail;
    private String made;
    private Integer amount;
    private Double money;
    private LocalDate petBirthday;
    private String image;
    private Byte status;
    private Integer categoryId;
    private Integer catalogId;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPetName() {
        return this.petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getPetType() {
        return this.petType;
    }

    public void setPetType(String petType) {
        this.petType = petType;
    }

    public String getPetGender() {
        return this.petGender;
    }

    public void setPetGender(String petGender) {
        this.petGender = petGender;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetail() {
        return this.detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getMade() {
        return this.made;
    }

    public void setMade(String made) {
        this.made = made;
    }

    public Integer getAmount() {
        return this.amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public Double getMoney() {
        return this.money;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public LocalDate getPetBirthday() {
        return this.petBirthday;
    }

    public void setPetBirthday(LocalDate petBirthday) {
        this.petBirthday = petBirthday;
    }

    public String getImage() {
        return this.image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Byte getStatus() {
        return this.status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public Integer getCategoryId() {
        return this.categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Integer getCatalogId() {
        return this.catalogId;
    }

    public void setCatalogId(Integer catalogId) {
        this.catalogId = catalogId;
    }
}
