package com.demo.services;

import com.demo.dtos.PetDto;
import com.demo.dtos.PetImageDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PetService {
    List<PetDto> findAllPetsBySpecies(String species);
    List<String> getAllDistinctSpecies();
    PetDto findPetById(Integer id);
    List<PetDto> findByName(String name);
    List<PetDto> findAll();
    PetDto updatePet(Integer id, PetDto petDto);
    PetDto addPetWithImage(PetDto petDto, MultipartFile imageFile);
    List<PetImageDto> findAllImagesByPetId(Integer petId);
    PetImageDto addPetImage(Integer petId, MultipartFile imageFile);
    boolean deletePetImage(Integer imageId);
    PetImageDto updateMainImage(Integer petId, Integer imageId);
}
