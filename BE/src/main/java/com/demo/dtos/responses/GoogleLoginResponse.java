package com.demo.dtos.responses;

import lombok.Data;

@Data
public class GoogleLoginResponse {
    private Integer userId;
    private String accessToken;
    private String refreshToken;
    private String username;
    private String fullName;
    private String role;
}
