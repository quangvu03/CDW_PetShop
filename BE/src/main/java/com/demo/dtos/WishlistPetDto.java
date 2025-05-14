package com.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WishlistPetDto {
    private int id;
    private String name;
    private String species;
    private String breed;
    private double price;
    private int quantity;
    private String imageUrl;
    private String gender;
    private Integer age;
    private String color;
    private String size;
    private String origin;
    private String description;
    private String status;
}
