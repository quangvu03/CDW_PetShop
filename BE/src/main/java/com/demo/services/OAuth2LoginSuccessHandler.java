package com.demo.services;

import com.demo.dtos.responses.GoogleLoginResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.io.IOException;
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final OAuth2Service oAuth2Service;
    public OAuth2LoginSuccessHandler(OAuth2Service oAuth2Service) {
        this.oAuth2Service = oAuth2Service;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        GoogleLoginResponse tokenResponse = oAuth2Service.processGoogleLogin(oAuth2User);

        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:3000/auth/oauth2/redirect")
                .queryParam("accessToken", tokenResponse.getAccessToken())
                .queryParam("refreshToken", tokenResponse.getRefreshToken())
                .queryParam("username", tokenResponse.getUsername())
                .queryParam("role", tokenResponse.getRole())
                .queryParam("userId", tokenResponse.getUserId())
                .queryParam("fullName", tokenResponse.getFullName()) // 👈 Không encode thủ công
                .build()
                .encode()
                .toUriString();
        response.sendRedirect(redirectUrl);
    }
}
