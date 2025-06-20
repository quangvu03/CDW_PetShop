package com.demo.services;

import com.demo.dtos.UsersDto;
import com.demo.dtos.requests.RegisterRequest;
import com.demo.entities.User;
import com.demo.helpers.RandomNumberHelper;
import com.demo.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
        }


        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        // ✅ Tạo user mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("user");
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setSecurityCode(RandomNumberHelper.generate6DigitString());
        user.setAvatar("Unknown_person.jpg");

        userRepository.save(user);

        // ✅ Gửi mail xác thực
        emailService.send(
                "lephuc11232@gmail.com",
                user.getEmail(),
                "Xác thực tài khoản PetShop",
                "Đây là mã xác thực tài khoản của bạn: " + user.getSecurityCode()
        );
    }


    @Override
    public boolean verify(String email, String security_code) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getSecurityCode().equals(security_code)) {
            user.setStatus(1);
            user.setSecurityCode(null);
            user.setUpdatedAt(Instant.now());
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<UsersDto> findAll() {
        List<User> users = userRepository.findAll();

        if (users.isEmpty()) {
            throw new IllegalArgumentException("Lỗi: không có user!");
        } else {
            return users.stream()
                    .map(user -> {
                        UsersDto dto = new UsersDto();
                        dto.setId(user.getId());
                        dto.setUsername(user.getUsername());
                        dto.setEmail(user.getEmail());
                        dto.setFullName(user.getFullName());
                        dto.setGender(user.getGender());
                        dto.setBirthday(user.getBirthday());
                        dto.setPhone(user.getPhone());
                        dto.setAddress(user.getAddress());
                        dto.setAvatar(user.getAvatar());
                        dto.setRole(user.getRole());
                        return dto;
                    })
                    .collect(Collectors.toList());
        }
    }

    @Override
    public UsersDto findById(int id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("Thông tìm thấy người dùng với ID: " + id);
        } else {
            UsersDto dto = new UsersDto();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setFullName(user.getFullName());
            dto.setGender(user.getGender());
            dto.setAddress(user.getAddress());
            dto.setBirthday(user.getBirthday());
            dto.setPhone(user.getPhone());
            dto.setAvatar(user.getAvatar());
            dto.setRole(user.getRole());
            return dto;
        }
    }


}
