package com.demo.dtos.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewRequest {
    int userId;
    int petId;
    int orderId;
    int rating;
}