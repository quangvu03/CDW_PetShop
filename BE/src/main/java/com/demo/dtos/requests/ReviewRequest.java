package com.demo.dtos.requests;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    int userId;
    int petId;

    int orderId;

    @Size(min = 1, max = 5, message = "Đánh giá phải từ 1 đến 5 sao")
    int rating;
}