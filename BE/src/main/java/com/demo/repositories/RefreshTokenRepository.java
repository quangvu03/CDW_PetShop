package com.demo.repositories;

import com.demo.entities.RefreshToken;
import com.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    int deleteByUser(User user);
}
