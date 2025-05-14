package com.demo.controllers;

import com.demo.dtos.requests.LoginRequest;
import com.demo.dtos.requests.OtpRequest;
import com.demo.dtos.requests.RegisterRequest;
import com.demo.dtos.responses.ApiResponse;
import com.demo.entities.User;
import com.demo.repositories.UserRepository;
import com.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private ResetTokenUtil resetTokenUtil;
    @Value("${jwt.reset.expiration.ms}")
    private long resetTokenDuration;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
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

    // ✅ Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verify(@RequestBody OtpRequest request) {
        boolean result = userService.verify(request.getEmail(), request.getOtp());
        if (result) {
            return ResponseEntity.ok(new ApiResponse(true, "Xác thực tài khoản thành công"));
        } else {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Xác thực thất bại hoặc mã không hợp lệ. Vui lòng thử lại"));
        }
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            User user = userRepository.findByUsername(request.getUsername());
            String token = jwtUtil.generateToken(user);
            String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("accessToken", token);
            response.put("refreshToken", refreshToken);
            response.put("username", user.getUsername());
            response.put("full_name", user.getFullName()); // Cho phép null nếu không có tên
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai tài khoản hoặc mật khẩu");
        }
    }

    // ✅ Refresh token
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> body) {
        String requestToken = body.get("refreshToken");

        return refreshTokenService.findByToken(requestToken)
                .map(refreshToken -> {
                    if (refreshTokenService.isExpired(refreshToken)) {
                        refreshTokenService.deleteByUser(refreshToken.getUser());
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse(false, "Refresh token đã hết hạn, vui lòng đăng nhập lại"));
                    }

                    String newAccessToken = jwtUtil.generateToken(refreshToken.getUser());
                    return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
                })
                .orElseGet(() ->
                        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ApiResponse(false, "Refresh token không hợp lệ"))
                );
    }
//    quen mk -> gui mail
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email không tồn tại"));
        }

        String token = resetTokenUtil.generateResetToken(email, resetTokenDuration);
        String resetLink = "http://localhost:3000/auth/reset-password?token=" + token;

        String emailContent = """
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Yêu cầu đặt lại mật khẩu</h2>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng nhấn nút bên dưới để đặt lại mật khẩu:</p>
      <a href="%s" style="display:inline-block;padding:12px 24px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;">
        Đặt lại mật khẩu
      </a>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
      <p style="margin-top: 20px;">Cảm ơn bạn,<br/>PetShop Team</p>
    </div>
""".formatted(resetLink);

        emailService.send("lephuc11232@gmail.com", email, "Khôi phục mật khẩu", emailContent);


        return ResponseEntity.ok(new ApiResponse(true, "Email đặt lại mật khẩu đã được gửi"));
    }
//    reset mk
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("password");

        try {
            String email = resetTokenUtil.validateAndExtractEmail(token);
            User user = userRepository.findByEmail(email);
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Đặt lại mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Token không hợp lệ hoặc đã hết hạn"));
        }
    }
//    doi mk
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        // Tách token để lấy username
        String jwt = token.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(jwt);
        User user = userRepository.findByUsername(username);

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Mật khẩu hiện tại không đúng"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "Đổi mật khẩu thành công"));
    }
    // lay thong tin cua user dang nhap
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        User user = userService.findByUsername(username);
        return ResponseEntity.ok(user);
    }
}
