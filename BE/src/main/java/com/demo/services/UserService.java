package com.demo.services;

import com.demo.dtos.UsersDto;
import com.demo.dtos.requests.RegisterRequest;
import com.demo.entities.User;

import java.util.List;

public interface UserService {
    void register(RegisterRequest registerRequest);
    boolean verify(String email, String security_code);
    User findByUsername(String username);
    User save(User user);
    List<UsersDto> findAll();
    UsersDto findById(int id);
}
