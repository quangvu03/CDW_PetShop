package com.example.configurations;

import com.example.dtos.UsersDTO;
import com.example.entities.Users;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Usermapper {

    @Autowired
    private ModelMapper modelMapper;


    public UsersDTO convertToUsersDTO(Users user) {
        return modelMapper.map(user, UsersDTO.class);
    }

    public Users convertToUsersEntity(UsersDTO usersDTO) {
        return modelMapper.map(usersDTO, Users.class);
    }
}
