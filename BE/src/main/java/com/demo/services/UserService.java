package com.demo.services;

import com.demo.dtos.requests.RegisterRequest;
import com.demo.entities.User;

public interface UserService {
    void register(RegisterRequest registerRequest);
    boolean verify(String email, String security_code);
    User findByUsername(String username);
    User save(User user);
}
