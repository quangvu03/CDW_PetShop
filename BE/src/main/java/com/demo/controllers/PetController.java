package com.demo.controllers;

import com.demo.dtos.PetDto;
import com.demo.services.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}