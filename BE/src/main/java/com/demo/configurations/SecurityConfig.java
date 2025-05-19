package com.demo.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order; // <-- Thêm import Order
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // <-- Thêm import AntPathRequestMatcher
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // *** SecurityFilterChain cho Tài Nguyên Tĩnh (Ưu tiên thấp hơn - chạy trước) ***
    @Bean
    @Order(1) // Đặt thứ tự ưu tiên (số nhỏ chạy trước)
    public SecurityFilterChain staticResourcesFilterChain(HttpSecurity http) throws Exception {
        http
                // Chỉ áp dụng cho các request GET đến /uploads/**
                .securityMatcher(AntPathRequestMatcher.antMatcher(HttpMethod.GET, "/uploads/**"))
                // Vô hiệu hóa các tính năng không cần thiết cho file tĩnh
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Vẫn cần CORS
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(AbstractHttpConfigurer::disable) // Không cần session
                .securityContext(AbstractHttpConfigurer::disable) // Không cần security context
                .requestCache(AbstractHttpConfigurer::disable) // Không cần cache request
                .logout(AbstractHttpConfigurer::disable) // Không cần logout
                .anonymous(AbstractHttpConfigurer::disable) // Không cần anonymous user
                // Cho phép tất cả request khớp với securityMatcher này
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    // *** SecurityFilterChain Chính cho API (Ưu tiên cao hơn - chạy sau) ***
    @Bean
    @Order(2) // Ưu tiên cao hơn (số lớn chạy sau)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {
        http
                // Chỉ áp dụng cho các đường dẫn khác KHÔNG phải /uploads/**
                // (Hoặc áp dụng cho /api/** nếu bạn muốn rõ ràng)
                // .securityMatcher("/api/**", "/auth/**") // Có thể thêm nếu muốn

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Public endpoints (không cần lặp lại /uploads/** ở đây)
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pets/species", "/api/pets/species/**", "/api/pets/{id:\\d+}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/shipping/**").permitAll()
                        .requestMatchers("/api/order/**").authenticated()
                        // Authenticated endpoints
                        .requestMatchers("/api/auth/me").authenticated()
                        // Thêm các quy tắc authenticated khác nếu cần

                        // Mọi request còn lại (trong phạm vi của filter chain này) cần xác thực
                        .anyRequest().authenticated()
                )
                // Thêm JwtFilter CHỈ cho filter chain này
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // --- BEAN CẤU HÌNH CORS (Giữ nguyên) ---
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configurationApi = new CorsConfiguration();
        configurationApi.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configurationApi.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configurationApi.setAllowedHeaders(List.of("*"));
        configurationApi.setAllowCredentials(true);
        configurationApi.setMaxAge(3600L);

        CorsConfiguration configurationUploads = new CorsConfiguration();
        configurationUploads.setAllowedOrigins(configurationApi.getAllowedOrigins());
        configurationUploads.setAllowedMethods(List.of("GET", "OPTIONS")); // Chỉ cần GET, OPTIONS cho uploads
        configurationUploads.setAllowedHeaders(configurationApi.getAllowedHeaders());
        configurationUploads.setAllowCredentials(configurationApi.getAllowCredentials()); // Có thể set false
        configurationUploads.setMaxAge(configurationApi.getMaxAge());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configurationApi);
        source.registerCorsConfiguration("/uploads/**", configurationUploads); // Đăng ký riêng

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}