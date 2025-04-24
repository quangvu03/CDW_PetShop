package com.demo.dtos.requests;


import lombok.Data;

@Data
public class OtpRequest {
    private String email;
    private String otp;
}
