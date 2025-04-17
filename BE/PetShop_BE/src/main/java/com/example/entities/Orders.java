package com.example.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "phoneNumber")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @Column(name = "note")
    private String note;

    @Column(name = "orderDate")
    private LocalDateTime orderDate;

    @Column(name = "totalMoney")
    private Float totalMoney;

    @Column(name = "status")
    private Integer status;

    @Column(name = "userId")
    private Integer userId;

    @Column(name = "addressId")
    private Integer addressId;

    @Column(name = "signature")
    private String signature;

    @Column(name = "publicKeyId")
    private Integer publicKeyId;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNote() {
        return this.note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getOrderDate() {
        return this.orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Float getTotalMoney() {
        return this.totalMoney;
    }

    public void setTotalMoney(Float totalMoney) {
        this.totalMoney = totalMoney;
    }

    public Integer getStatus() {
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getUserId() {
        return this.userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAddressId() {
        return this.addressId;
    }

    public void setAddressId(Integer addressId) {
        this.addressId = addressId;
    }

    public String getSignature() {
        return this.signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public Integer getPublicKeyId() {
        return this.publicKeyId;
    }

    public void setPublicKeyId(Integer publicKeyId) {
        this.publicKeyId = publicKeyId;
    }
}
