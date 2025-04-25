package com.demo.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor // Constructor không tham số
@AllArgsConstructor // Constructor với tất cả tham số
public class PetDto {
    private int id;
    private String name;
    private String species;
    private String breed;
    private double price;
    private String imageUrl; // URL của ảnh đại diện


}
