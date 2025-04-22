package com.example.petshop_be.repositories;

import com.example.petshop_be.entities.Pets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service

public interface PetRepository extends JpaRepository<Pets, Integer> {
}