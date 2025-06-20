package com.demo.dtos.requests;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @Size(max = 255, message = "Địa chỉ quá dài")
    String shippingAddress;

    int shippingMethodId;

    @Pattern(
            regexp = "^(\\+84|0)[0-9]{9,10}$",
            message = "Số điện thoại không hợp lệ"
    )
    String phoneNumber;

    String shippingName;
}
