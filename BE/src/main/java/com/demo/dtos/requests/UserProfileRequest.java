package com.demo.dtos.requests;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
@Data
public class UserProfileRequest {
    private String fullName;
    private String birthday;
    private String gender;
    private String phoneNumber;
    private String address;
    private MultipartFile avatar;
}
