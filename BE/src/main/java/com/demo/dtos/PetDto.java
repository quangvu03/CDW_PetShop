package com.demo.dtos;

import com.demo.entities.Pet;
import com.demo.entities.PetImage;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PetDto {
    private int id;
    private String name;
    private String species;
    private String breed;
    private double price;
    private int quantity;
    private String imageUrl; // URL của ảnh đại diện
    private String gender;
    private Integer age;
    private String color;
    private String size;
    private String origin;
    private String description;
    private String status;
    private List<String> imageUrls;


    public PetDto(Pet pet) {
        this.id = pet.getId();
        this.name = pet.getName();
        this.species = pet.getSpecies();
        this.breed = pet.getBreed();
        this.price = pet.getPrice();
        this.quantity = pet.getQuantity();
        this.gender = pet.getGender();
        this.age = pet.getAge();
        this.color = pet.getColor();
        this.size = pet.getSize();
        this.origin = pet.getOrigin();
        this.description = pet.getDescription();
        this.status = pet.getStatus();

        // ✅ Gán imageUrl từ ảnh đầu tiên trong danh sách
        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
            this.imageUrl = pet.getImages().get(0).getImageUrl();
            this.imageUrls = pet.getImages().stream()
                    .map(PetImage::getImageUrl)
                    .collect(Collectors.toList());
        }
    }
}

