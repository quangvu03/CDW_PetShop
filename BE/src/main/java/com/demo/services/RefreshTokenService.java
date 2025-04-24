package com.demo.services;

import com.demo.entities.RefreshToken;
import com.demo.entities.User;
import jakarta.transaction.Transactional;

import java.util.Optional;

public interface RefreshTokenService {
    public RefreshToken createRefreshToken(int userId);
    public Optional<RefreshToken> findByToken(String token);
    public boolean isExpired(RefreshToken token);
    @Transactional
    public void deleteByUser(User user);
}
