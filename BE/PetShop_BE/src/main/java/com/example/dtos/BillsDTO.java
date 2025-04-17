package com.example.dtos;

import java.time.LocalDateTime;

public class BillsDTO {
    private Integer id;
    private Integer orderId;
    private Integer paymentMethod;
    private Byte status;
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
