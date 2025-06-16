package com.demo.services;

import com.demo.dtos.responses.GoogleLoginResponse;
import org.springframework.security.oauth2.core.user.OAuth2User;

public interface OAuth2Service {
    GoogleLoginResponse processGoogleLogin(OAuth2User oAuth2User);
}