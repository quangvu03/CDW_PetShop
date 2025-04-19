package com.example.petshop_be.configurations;

import com.example.petshop_be.dtos.UsersDTO;
import com.example.petshop_be.entities.Users;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class Usermapper {
    private final ModelMapper modelMapper;

    public Usermapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public UsersDTO convertToUsersDTO(Users user) {
        return modelMapper.map(user, UsersDTO.class);
    }

    public Users convertToUsersEntity(UsersDTO usersDTO) {
        return modelMapper.map(usersDTO, Users.class);
    }
}