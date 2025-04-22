package com.example.petshop_be.controllers;

import com.example.petshop_be.configurations.Usermapper;
import com.example.petshop_be.dtos.ChangepassRequetsDTO;
import com.example.petshop_be.entities.Users;
import com.example.petshop_be.helpers.RandomHepler;
import com.example.petshop_be.repositories.UserRepository;
import com.example.petshop_be.services.MailService;
import com.example.petshop_be.services.Userservice;
import com.example.petshop_be.dtos.UsersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/account")
public class UserController {


    @Autowired
    private Userservice userservice;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Usermapper usermapper;

    @Autowired
    private MailService mailService;

    @Autowired
    Environment environment;

    @PostMapping(value = "/login",consumes = MimeTypeUtils.APPLICATION_JSON_VALUE,
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> login(@RequestBody UsersDTO usersDTO) {
        Map<String, Object> response = new HashMap<>();
        Users users = userRepository.findByUserName(usersDTO.getUserName());
        if(users.getStatus()<1){
            response.put("result", "Vui lòng xác thực tài khoản để đăng nhập");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        try {
            boolean loginResult = userservice.login(usersDTO.getUserName(), usersDTO.getPassword());
            response.put("result", loginResult);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("result", false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = {"/register"}, consumes = MimeTypeUtils.APPLICATION_JSON_VALUE,
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> register(@RequestBody UsersDTO users) {
        Map<String, Object> result = new HashMap<>();

        UsersDTO existingUser = userservice.findByEmail(users.getEmail());
        if (existingUser != null) {
            result.put("error", "Tài khoản với email này đã tồn tại");
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }

        try {
            boolean saved = userservice.save(users);
            if (saved) {
                result.put("success", true);
                return new ResponseEntity<>(result, HttpStatus.OK);
            } else {
                result.put("error", "Không thể đăng ký tài khoản");
                return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "Lỗi server: " + e.getMessage());
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam("email") String email,
                                                      @RequestParam("securitycode") String code) {
        Map<String, String> result = new HashMap<>();
        UsersDTO accountDTO = userservice.findByEmail(email);

        if (accountDTO == null) {
            result.put("err", "Email không tồn tại");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        if (!accountDTO.getSecurityCode().equals(code)) {
            result.put("err", "Không thể kích hoạt tài khoản");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        Users users = usermapper.convertToUsersEntity(accountDTO);
        users.setStatus((byte) 1);
        userRepository.save(users);
        result.put("successfully", "done!");
        return ResponseEntity.ok(result);
    }
    @GetMapping("/findByEmail")
    public ResponseEntity<Object> findByEmail(@RequestParam("email") String email) {
        try {
            UsersDTO user = userservice.findByEmail(email);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Không tìm thấy user với email: " + email);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Lỗi server khi tìm user");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changpassWord( @RequestBody ChangepassRequetsDTO changepassRequetsDTO) {
        try {
            String result = userservice.changePassword(changepassRequetsDTO);
            if(result.equals("done")){
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.OK);
            }else {
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Lỗi server khi đổi mật khẩu");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping ("/updateUser")
    public ResponseEntity<?> changpassWord( @RequestBody UsersDTO usersDTO) {
        try {
            String result = userservice.updateUser(usersDTO);
            if(result.equals("done")){
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.OK);
            }else {
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = new HashMap<>();
            response.put("error", "Lỗi server khi thay đổi thông tin");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/sendOTP")
    public ResponseEntity<Map<String, String>> sendOTP(@RequestParam String email) {

        boolean result;
        try {
            Users users = userRepository.findByEmail(email);
            String otp = RandomHepler.generateOTP();

            if(users == null){
                return new ResponseEntity<>(Map.of("otp", "Tài khoản chưa được đăng kí"), HttpStatus.OK);
            }
            result = mailService.sendOtpEmail(email, otp);
            if (result) {
                return new ResponseEntity<>(Map.of("otp", otp), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(Map.of("otp", "Gửi OTP thất bại"), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Lỗi server khi gửi OTP: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/forgotpassword")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestParam("email") String email,
                                                              @RequestParam("password") String password) {
        System.out.println("email: "+email);
        System.out.println("password: "+password);

        try {
            String result = userservice.forgotPassword(password, email);
            if(result.equals("done")){
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(Map.of("result", result), HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Lỗi khi thay đổi mật khẩu: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/uploadAvatar/{userName}")
    public ResponseEntity<?> updateUserAvatar(
            @PathVariable String userName,
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn file để upload");
            }
            Users user = userRepository.findByUserName(userName);
            if(user == null){
                return new ResponseEntity<>(Map.of("result","User không tồn tại"), HttpStatus.OK);
            }
            String newFileName = userservice.uploadImage(file);
            user.setImage(newFileName);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("result", newFileName));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi cập nhật avatar: " + e.getMessage());
        }
    }
}
