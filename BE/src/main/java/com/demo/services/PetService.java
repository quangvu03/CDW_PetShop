package com.demo.services;

import com.demo.dtos.PetDto;

import java.util.List;

public interface PetService {
    public List<PetDto> findAllPetsBySpecies(String species);
    public List<String> getAllDistinctSpecies();
    public PetDto findPetById(Integer id);
    List<PetDto> findByName(String name);
}
