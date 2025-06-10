package com.demo.dtos;

import com.demo.entities.PetImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PetImageDto {
    private int id;
    private int petId;
    private String imageUrl;
    private Boolean isMain;

    public PetImageDto(PetImage petImage) {
        this.id = petImage.getId();
        this.petId = petImage.getPet().getId();
        this.imageUrl = petImage.getImageUrl();
        this.isMain = petImage.getIsMain();
    }
}