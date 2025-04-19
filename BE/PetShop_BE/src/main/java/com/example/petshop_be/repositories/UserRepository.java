package com.example.petshop_be.repositories;

import com.example.petshop_be.entities.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public interface UserRepository extends CrudRepository<Users, Integer> {
    Users findByEmail(String email);

    Users findByUserName(String userName);

}
