package com.demo.dtos;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrdersDto {
    private Integer id;
    private Instant orderDate;
    private BigDecimal totalPrice;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String shippingAddress;
    private String shippingName;
    private String phoneNumber;
    private String checkoutUrl;
    private Instant expiredAt;
}