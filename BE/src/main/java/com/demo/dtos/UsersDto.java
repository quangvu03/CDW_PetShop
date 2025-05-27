package com.demo.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Data
public class UsersDto {
    private Integer id;
    private String username;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String fullName;
    private String gender;
    private LocalDate birthday;
    private String phone;
    private String address;
    private String avatar;
    private String role;

}
