package com.demo.controllers;

import com.demo.dtos.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    @GetMapping
    public ResponseEntity<ApiResponse> testToken() {
        return ResponseEntity.ok(new ApiResponse(true, "✅ Token hợp lệ! Truy cập thành công."));
    }
}
