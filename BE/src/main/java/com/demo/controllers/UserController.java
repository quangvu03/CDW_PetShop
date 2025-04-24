package com.demo.controllers;

import com.demo.dtos.requests.UserProfileRequest;
import com.demo.entities.User;
import com.demo.services.JwtUtil;
import com.demo.services.UserService;
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
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @ModelAttribute UserProfileRequest profile,
            @RequestHeader("Authorization") String token
    ) {
        try {
            String jwt = token.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(jwt);

            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Người dùng không tồn tại");
            }

            user.setFullName(profile.getFullName());
            user.setGender(profile.getGender());
            user.setPhone(profile.getPhoneNumber());
            user.setAddress(profile.getAddress());

            if (profile.getBirthday() != null && !profile.getBirthday().isEmpty()) {
                try {
                    LocalDate parsedBirthday = LocalDate.parse(profile.getBirthday());
                    user.setBirthday(parsedBirthday);
                } catch (DateTimeParseException e) {
                    return ResponseEntity.badRequest().body("❌ Ngày sinh không hợp lệ (định dạng yyyy-MM-dd)");
                }
            }

            MultipartFile avatar = profile.getAvatar();
            if (avatar != null && !avatar.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + avatar.getOriginalFilename();
                Path uploadPath = Paths.get("uploads/avatars");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(avatar.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                user.setAvatar(fileName);
            }

            user.setUpdatedAt(Instant.now());
            userService.save(user);

            return ResponseEntity.ok("✅ Cập nhật thông tin thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Lỗi cập nhật: " + e.getMessage());
        }
    }
}
