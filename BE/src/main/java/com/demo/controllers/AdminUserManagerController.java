package com.demo.controllers;

import com.demo.dtos.UsersDto;
import com.demo.dtos.requests.RegisterRequest;
import com.demo.dtos.responses.ApiResponse;
import com.demo.entities.User;
import com.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminUserManagerController {


    @Autowired
    private UserService userService;


    @GetMapping("/findAllUser")
    public ResponseEntity<?> findAllUser() {
        try {
            List<UsersDto> users = userService.findAll();
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi lấy danh sách người dùng");
        }
    }

    @PostMapping("/createUser")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok(new ApiResponse(true, "Đăng ký thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Đăng ký thất bại: " + e.getMessage()));
        }
    }

    @GetMapping("/findUserById/{id}")
    public ResponseEntity<?> findUserById(@PathVariable("id") int id) {
        try {
            UsersDto user = userService.findById(id);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng với ID: " + id);
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi khi lấy thông tin người dùng");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @ModelAttribute UsersDto usersDto,
            @RequestParam(value = "image", required = false) MultipartFile avatarFile
    ) {
        try {
            User user = userService.findByUsername(usersDto.getUsername());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng không tồn tại");
            }

            user.setFullName(usersDto.getFullName());
            user.setRole(usersDto.getRole());
            user.setAddress(usersDto.getAddress());
            user.setBirthday(usersDto.getBirthday());
            user.setGender(usersDto.getGender());
            user.setPhone(usersDto.getPhone());
            user.setUpdatedAt(Instant.now());

            if (avatarFile != null && !avatarFile.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + avatarFile.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/avatars");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(avatarFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                user.setAvatar(fileName);
            }

            userService.save(user);
            return ResponseEntity.ok("✅ Cập nhật thông tin thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Lỗi cập nhật: " + e.getMessage());
        }
    }

}
