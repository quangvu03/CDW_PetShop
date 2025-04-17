package com.example.Services;
import com.example.dtos.UsersDTO;

public interface Userservice {

    boolean save(UsersDTO usersDTO) ;


    UsersDTO findByEmail(String email);
}
