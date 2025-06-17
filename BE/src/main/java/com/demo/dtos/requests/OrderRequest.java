package com.demo.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@ToString
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderRequest {

    @Positive(message = "userId phải là số dương")
    int userId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Tổng giá trị đơn hàng phải lớn hơn 0")
    BigDecimal totalPrice;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    String paymentMethod;

    @NotBlank(message = "Trạng thái thanh toán không được để trống")
    String paymentStatus;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    String shippingAddress;

    String phoneNumber;
    
    String shippingName;

    @Positive(message = "ID phương thức vận chuyển không hợp lệ")
    int shippingMethodId;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    List<OrderItemRequest> orderRequestList;
}
