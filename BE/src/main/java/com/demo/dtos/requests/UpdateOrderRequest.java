package com.demo.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateOrderRequest {
    int orderId;
    String status;
    String paymentStatus;
    BigDecimal totalPrice;
    String paymentMethod;
    String shippingAddress;
    int shippingMethodId;
    String phoneNumber;
    String shippingName;
}
