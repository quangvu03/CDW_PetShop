package com.demo.dtos.requests;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserProfileRequest {

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
    private String fullName;

    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Ngày sinh phải đúng định dạng yyyy-MM-dd")
    private String birthday;

    @Pattern(regexp = "^(male|female|other)?$", message = "Giới tính không hợp lệ")
    private String gender;

    @Pattern(
            regexp = "^(\\+84|0)[0-9]{9,10}$",
            message = "Số điện thoại không hợp lệ"
    )
    private String phoneNumber;

    @Size(max = 255, message = "Địa chỉ quá dài")
    private String address;

    private MultipartFile avatar;
}
