package com.demo.dtos.requests;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemRequest {

    // Có thể gửi 1 trong 2 (pet hoặc product)
    @PositiveOrZero(message = "petId không hợp lệ")
    int petId;

    @PositiveOrZero(message = "productId không hợp lệ")
    int productId;

    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    int quantity;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá phải lớn hơn 0")
    BigDecimal price;
}
