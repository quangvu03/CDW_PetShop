package com.example.petshop_be.controllers;

import com.example.petshop_be.services.Userservice;
import com.example.petshop_be.dtos.UsersDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/account")
public class UserController {

    @Autowired
    private Userservice userservice;

    @PostMapping(value = "login",consumes = MimeTypeUtils.APPLICATION_JSON_VALUE,
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> login(@RequestBody UsersDTO usersDTO) {
        Map<String, Object> response = new HashMap<>();
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


    @PostMapping(value = {"register"}, consumes = MimeTypeUtils.APPLICATION_JSON_VALUE,
            produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> register(@RequestBody UsersDTO users) {
        Map<String, Boolean> result = new HashMap<>();
        try {
            result.put("result", userservice.save(users));
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            result.put("error", userservice.save(users));
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify(@RequestParam("email") String email,
                                                      @RequestParam("scurity") String code) {
        Map<String, String> result = new HashMap<>();
        UsersDTO account = userservice.findByEmail(email);

        if (account == null) {
            result.put("err", "Email không tồn tại");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        if (!account.getSecurityCode().equals(code)) {
            result.put("err", "Không thể kích hoạt tài khoản");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }

        account.setStatus((byte) 1);
        userservice.save(account);
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
}
