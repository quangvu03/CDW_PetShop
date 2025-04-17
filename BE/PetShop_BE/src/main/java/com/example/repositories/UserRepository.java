package com.example.repositories;

import com.example.dtos.UsersDTO;
import com.example.entities.Users;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

@Service
public interface UserRepository extends CrudRepository<Users, Integer> {
    Users findByEmail(String email);

}
