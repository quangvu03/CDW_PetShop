package com.example.petshop_be.dtos;

import java.time.LocalDateTime;

public class OrdersDTO {
    private Integer id;
    private String phoneNumber;
    private String email;
    private String note;
    private LocalDateTime orderDate;
    private Float totalMoney;
    private Integer status;
    private Integer userId;
    private Integer addressId;
    private String signature;
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
