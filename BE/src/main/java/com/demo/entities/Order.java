package com.demo.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@ToString
@Getter
@Setter
@Entity
@Table(name = "orders", indexes = {
        @Index(name = "user_id", columnList = "user_id")
})
public class Order {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ColumnDefault("current_timestamp()")
    @Column(name = "order_date", nullable = false)
    private Instant orderDate;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Lob
    @Column(name = "status")
    private String status;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Lob
    @Column(name = "payment_status")
    private String paymentStatus;

    @Lob
    @Column(name = "shipping_address")
    private String shippingAddress;

    @ManyToOne
    @JoinColumn(name = "shipping_method_id")
    private ShippingMethod shippingMethod;

    @Column(name = "payos_order_code")
    private Long payosOrderCode;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber; // Thêm trường phone_number

    @Lob
    @Column(name = "name")
    private String name; // Thêm trường name

    @Column(name = "checkout_url", length = 255)
    private String checkoutUrl; // Thêm trường checkout_url

    @Column(name = "expired_at")
    private Instant expiredAt; // Thêm trường expired_at
}