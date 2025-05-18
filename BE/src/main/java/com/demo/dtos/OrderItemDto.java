package com.demo.dtos;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemDto {
    int orderId;
    Instant orderDate;
    BigDecimal totalPrice;
    String status;
    String paymentMethod;
    String paymentStatus;
    String shippingAddress;
    String shippingName;
    BigDecimal priceShipping;
    List<PetDto> petDtoList;
}
