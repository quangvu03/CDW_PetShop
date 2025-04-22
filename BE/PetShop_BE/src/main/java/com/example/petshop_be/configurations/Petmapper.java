package com.example.petshop_be.configurations;

import com.example.petshop_be.dtos.PetsDTO;
import com.example.petshop_be.entities.Pets;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public class Petmapper {

    private final ModelMapper modelMapper;

    public Petmapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public List<PetsDTO> convertToDTOs(List<Pets> pets) {
        return modelMapper.map(pets, new TypeToken<List<PetsDTO>>() {
        }.getType());
    }

    public List<Pets> convertToEntities(List<PetsDTO> petsDTOs) {
        return modelMapper.map(petsDTOs, new TypeToken<List<Pets>>() {
        }.getType());
    }

    public Pets convertToEntity(PetsDTO petsDTO) {
        return modelMapper.map(petsDTO, Pets.class);
    }

    public PetsDTO convertToDTO(Pets pet) {
        return modelMapper.map(pet, PetsDTO.class);
    }
}

