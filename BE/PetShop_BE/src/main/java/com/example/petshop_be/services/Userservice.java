package com.example.petshop_be.services;
import com.example.petshop_be.dtos.UsersDTO;

public interface Userservice {

    boolean save(UsersDTO usersDTO) ;

    UsersDTO findByEmail(String email);

    boolean login(String username, String password);
}
