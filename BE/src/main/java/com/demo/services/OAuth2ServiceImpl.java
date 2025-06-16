package com.demo.services;

import com.demo.dtos.responses.GoogleLoginResponse;
import com.demo.entities.User;
import com.demo.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OAuth2ServiceImpl implements OAuth2Service {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public GoogleLoginResponse processGoogleLogin(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUsername(generateUsernameFromEmail(email));
            user.setFullName(name);
            user.setAvatar(picture);
            user.setRole("user");
            user.setStatus((byte) 1);
            user.setCreatedAt(Instant.now());
            user.setUpdatedAt(Instant.now());

            // Set random password để tránh lỗi Hibernate
            String randomPassword = UUID.randomUUID().toString();
            String encodedPassword = passwordEncoder.encode(randomPassword);
            user.setPassword(encodedPassword);

            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user);
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

        GoogleLoginResponse response = new GoogleLoginResponse();
        response.setUserId(user.getId());
        response.setAccessToken(token);
        response.setRefreshToken(refreshToken);
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return response;
    }

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0];
        String username = base;
        int i = 1;
        while (userRepository.existsByUsername(username)) {
            username = base + i;
            i++;
        }
        return username;
    }
}
