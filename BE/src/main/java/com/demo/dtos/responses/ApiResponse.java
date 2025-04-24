package com.demo.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor  // ✅ Viết đúng chữ hoa thường
public class ApiResponse {
    private boolean success;
    private String message;
}
