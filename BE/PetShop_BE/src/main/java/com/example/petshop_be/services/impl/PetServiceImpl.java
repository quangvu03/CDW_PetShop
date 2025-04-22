package com.example.petshop_be.services.impl;

import com.example.petshop_be.entities.Pets;
import com.example.petshop_be.repositories.PetRepository;
import com.example.petshop_be.services.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    @Autowired
    private PetRepository petRepository;

    @Override
    public List<Pets> finAll() {
        return petRepository.findAll();
    }
}
