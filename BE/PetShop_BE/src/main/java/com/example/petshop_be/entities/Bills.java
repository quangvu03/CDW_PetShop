package com.example.petshop_be.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
public class Bills {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "orderId")
    private Integer orderId;

    @Column(name = "paymentMethod")
    private Integer paymentMethod;

    @Column(name = "status")
    private Byte status;

    @Column(name = "createDate")
    private LocalDateTime createDate;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOrderId() {
        return this.orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getPaymentMethod() {
        return this.paymentMethod;
    }

    public void setPaymentMethod(Integer paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Byte getStatus() {
        return this.status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public LocalDateTime getCreateDate() {
        return this.createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
}
