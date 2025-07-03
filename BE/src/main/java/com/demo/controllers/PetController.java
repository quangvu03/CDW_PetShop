package com.demo.controllers;

import com.demo.dtos.PetDto;
import com.demo.dtos.PetImageDto;
import com.demo.services.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pet")
@CrossOrigin(origins = "*")
public class PetController {
    @Autowired
    private PetService petService;

    @GetMapping("/species/{speciesName}")
    public ResponseEntity<List<PetDto>> getAllPetsBySpecies(@PathVariable String speciesName
    ) {
        List<PetDto> petList = petService.findAllPetsBySpecies(speciesName);

        return ResponseEntity.ok(petList);
    }

    @GetMapping("/species")
    public ResponseEntity<List<String>> getAllSpecies() {
        List<String> speciesList = petService.getAllDistinctSpecies();
        return ResponseEntity.ok(speciesList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetDto> getPetById(@PathVariable Integer id) {
        PetDto petDto = petService.findPetById(id);
        return ResponseEntity.ok(petDto);
    }

    @GetMapping("/findByName")
    public ResponseEntity<List<PetDto>> findByName(@RequestParam("name") String name
    ) {
        List<PetDto> petList = petService.findByName(name);
        return ResponseEntity.ok(petList);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<PetDto>> getAllPetsByLatestCreatedAt() {
        List<PetDto> petList = petService.findAllSortedByCreatedAtDesc();
        return ResponseEntity.ok(petList);
    }

    @GetMapping("/best-selling")
    public ResponseEntity<List<PetDto>> getBestSellingPets() {
        List<PetDto> petList = petService.findBestSellingPets();
        return ResponseEntity.ok(petList);
    }

    @GetMapping("/best-selling-with-quantity")
    public ResponseEntity<List<Map<String, Object>>> getBestSellingPetsWithQuantity() {
        List<Map<String, Object>> petsWithQuantity = petService.findBestSellingPetsWithQuantitySold();
        return ResponseEntity.ok(petsWithQuantity);
    }

    @GetMapping("/most-viewed")
    public ResponseEntity<List<PetDto>> getMostViewedPets() {
        List<PetDto> petList = petService.findMostViewedPets();
        return ResponseEntity.ok(petList);
    }

    @GetMapping("/most-viewed-with-count")
    public ResponseEntity<List<Map<String, Object>>> getMostViewedPetsWithCount() {
        List<Map<String, Object>> petsWithViewCount = petService.findMostViewedPetsWithViewCount();
        return ResponseEntity.ok(petsWithViewCount);
    }
}
