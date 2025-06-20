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

    int userId;

    @DecimalMin(value = "0.0", inclusive = false, message = "Tổng giá trị đơn hàng phải lớn hơn 0")
    BigDecimal totalPrice;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    String paymentMethod;


    String paymentStatus;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    String shippingAddress;

    @Pattern(regexp = "^(0\\d{9}|\\+84\\d{9})$",message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @NotBlank(message = "Tên người nhận không được để trống")
    String shippingName;

    @Positive(message = "ID phương thức vận chuyển không hợp lệ")
    int shippingMethodId;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    List<OrderItemRequest> orderRequestList;
}
