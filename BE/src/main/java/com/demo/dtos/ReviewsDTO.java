package com.demo.dtos;

import lombok.Data;

import java.time.Instant;

@Data
public class ReviewsDTO {
    private Integer id;
    private Integer userId;
    private Integer petId;
    private Integer orderId;
    private Integer rating;
    private Instant createdAt;

}
