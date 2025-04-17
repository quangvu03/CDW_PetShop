package com.example.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "warehouseinvoice")
public class Warehouseinvoice {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "petId")
    private Integer petId;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "tradeDate")
    private LocalDate tradeDate;

    @Column(name = "status")
    private Byte status;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPetId() {
        return this.petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getTradeDate() {
        return this.tradeDate;
    }

    public void setTradeDate(LocalDate tradeDate) {
        this.tradeDate = tradeDate;
    }

    public Byte getStatus() {
        return this.status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }
}
