package com.demo.dtos;

import lombok.Data;

@Data
public class CartItemDto {
    private Integer id;
    private Integer quantity;
    private PetDto pet;
    private ProductDto product;
}
