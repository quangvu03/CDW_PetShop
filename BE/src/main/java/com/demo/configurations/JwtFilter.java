package com.demo.configurations;

import com.demo.services.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);
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
        if (requestURI != null && requestURI.startsWith("/uploads/")) {
            log.trace("Skipping JWT filter for static resource: {}", requestURI); // Dùng trace hoặc debug
            filterChain.doFilter(request, response); // Cho request đi tiếp ngay lập tức
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.trace("doFilterInternal: No JWT Token found in Authorization header for URI: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            username = jwtUtil.extractUsername(jwt);
            log.info("🔐 JWT filter activated - Token for user: {}", username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.debug("doFilterInternal: Token found for user '{}', validating...", username);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);


                if (jwtUtil.isTokenValid(jwt, userDetails)) { // <-- THAY isTokenValid nếu tên khác
                    log.debug("doFilterInternal: Token is valid for user '{}'. Setting authentication.", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credentials không cần thiết với JWT
                            userDetails.getAuthorities() // Lấy quyền từ UserDetails
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("doFilterInternal: Invalid JWT Token provided for user '{}'", username);
                }
            } else if (username == null) {
                log.warn("doFilterInternal: Could not extract username from JWT.");
            } else {
                log.trace("doFilterInternal: SecurityContext already contains Authentication for user '{}'", username);
            }
        } catch (Exception e) {

            log.warn("doFilterInternal: JWT Token processing error: {} - Token [{}...]", e.getMessage(), jwt != null ? jwt.substring(0, Math.min(jwt.length(), 10)) : "null");
        }
        filterChain.doFilter(request, response);
    }
}