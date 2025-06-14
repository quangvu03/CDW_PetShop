package com.demo.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {
    int userId;
    BigDecimal totalPrice;
    String paymentMethod;
    String paymentStatus;
    String shippingAddress;
    int shippingMethodId;
    List<OrderItemRequest> orderRequestList;


}
