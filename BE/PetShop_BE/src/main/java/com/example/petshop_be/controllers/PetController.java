package com.example.petshop_be.controllers;

import com.example.petshop_be.configurations.Petmapper;
import com.example.petshop_be.dtos.PetsDTO;
import com.example.petshop_be.entities.Pets;
import com.example.petshop_be.services.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/pet")
public class PetController {

    @Autowired
    private PetService petService;

    @Autowired
    private Petmapper petmapper;

    @GetMapping(value = "/findAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> listPetDTO() {
        try {
            List<Pets> pets = petService.finAll();
            if(pets.size() >0){
                return new ResponseEntity<>(petmapper.convertToDTOs(pets), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(Map.of("result", "danh sách rỗng"), HttpStatus.OK);
            }
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("result", "Lỗi "+e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
