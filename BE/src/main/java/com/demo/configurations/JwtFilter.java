package com.demo.configurations; // Đảm bảo đúng package

import com.demo.services.JwtUtil; // Đảm bảo đúng đường dẫn tới JwtUtil
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger; // Thêm import cho Logger
import org.slf4j.LoggerFactory; // Thêm import cho Logger
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService; // Import UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component; // Hoặc @Service
import org.springframework.web.filter.OncePerRequestFilter;
// Import các exception JWT nếu bạn catch cụ thể
// import io.jsonwebtoken.ExpiredJwtException;
// import io.jsonwebtoken.MalformedJwtException;
// import io.jsonwebtoken.SignatureException;

import java.io.IOException;

@Component // Đảm bảo đây là một Spring Bean
public class JwtFilter extends OncePerRequestFilter {

    // Khai báo Logger
    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    // Inject các dependency qua constructor (ưu tiên)
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    // Constructor Injection
    public JwtFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String requestURI = request.getRequestURI();

        // *** LOGIC BỎ QUA UPLOADS (Đã được thêm và giữ nguyên) ***
        // Nếu request bắt đầu bằng /uploads/, thì không cần kiểm tra JWT
        if (requestURI != null && requestURI.startsWith("/uploads/")) {
            log.trace("Skipping JWT filter for static resource: {}", requestURI); // Dùng trace hoặc debug
            filterChain.doFilter(request, response); // Cho request đi tiếp ngay lập tức
            return; // Kết thúc filter này cho request uploads
        }
        // *** KẾT THÚC LOGIC BỎ QUA ***

        // Logic xử lý JWT token cho các request khác (ví dụ: /api/**)
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Kiểm tra header Authorization và tiền tố "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Không có token hợp lệ, cho phép request đi tiếp để các filter sau xử lý
            // (Ví dụ: AnonymousAuthenticationFilter hoặc AuthorizationFilter sẽ kiểm tra quyền)
            log.trace("doFilterInternal: No JWT Token found in Authorization header for URI: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Trích xuất token (bỏ "Bearer ")
        jwt = authHeader.substring(7);

        try {
            // 3. Trích xuất username từ token
            username = jwtUtil.extractUsername(jwt); // Đảm bảo phương thức này tồn tại trong JwtUtil

            // 4. Kiểm tra username và SecurityContext
            // Chỉ xử lý nếu có username và chưa có ai được xác thực trong context hiện tại
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("doFilterInternal: Token found for user '{}', validating...", username);
                // 5. Lấy UserDetails từ UserDetailsService
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // 6. Xác thực token (kiểm tra chữ ký, hết hạn, và khớp userDetails)
                // *** ĐẢM BẢO TÊN PHƯƠNG THỨC NÀY ĐÚNG VỚI JwtUtil CỦA BẠN ***
                if (jwtUtil.isTokenValid(jwt, userDetails)) { // <-- THAY isTokenValid nếu tên khác
                    log.debug("doFilterInternal: Token is valid for user '{}'. Setting authentication.", username);
                    // 7. Tạo đối tượng Authentication
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credentials không cần thiết với JWT
                            userDetails.getAuthorities() // Lấy quyền từ UserDetails
                    );
                    // 8. Set chi tiết xác thực (IP, session ID,...)
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    // 9. Đặt đối tượng Authentication vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    // Token không hợp lệ dù username được trích xuất
                    log.warn("doFilterInternal: Invalid JWT Token provided for user '{}'", username);
                }
            } else if (username == null) {
                log.warn("doFilterInternal: Could not extract username from JWT.");
            } else {
                // Đã có Authentication trong context, không cần làm gì thêm
                log.trace("doFilterInternal: SecurityContext already contains Authentication for user '{}'", username);
            }
        } catch (Exception e) {
            // Xử lý các lỗi có thể xảy ra khi parse hoặc validate token
            // Ví dụ: ExpiredJwtException, SignatureException, MalformedJwtException,...
            // Log lỗi chi tiết hơn để debug
            log.warn("doFilterInternal: JWT Token processing error: {} - Token [{}...]", e.getMessage(), jwt.substring(0, Math.min(jwt.length(), 10)));
            // Không set Authentication -> request sẽ không được xác thực
            // Có thể clear context để đảm bảo an toàn
            // SecurityContextHolder.clearContext();
            // Có thể trả về lỗi 401/403 ngay tại đây nếu muốn
            // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
            // return;
        }

        // 10. Chuyển request và response cho filter tiếp theo trong chuỗi
        filterChain.doFilter(request, response);
    }
}