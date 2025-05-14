package com.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "vouchers", uniqueConstraints = {
        @UniqueConstraint(name = "code", columnNames = {"code"})
})
public class Voucher {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "code", length = 50)
    private String code;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(name = "max_uses")
    private Integer maxUses;

    @ColumnDefault("0")
    @Column(name = "used")
    private Integer used;

    @ColumnDefault("current_timestamp()")
    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

}