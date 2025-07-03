package com.demo.configurations;

import com.demo.services.CustomOAuth2UserService;
import com.demo.services.OAuth2LoginSuccessHandler;
import com.demo.services.OAuth2Service;
import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
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

    private final CustomOAuth2UserService customOAuth2UserService;

    public SecurityConfig(
            JwtFilter jwtFilter,
            CustomOAuth2UserService customOAuth2UserService
    ) {
        this.jwtFilter = jwtFilter;
        this.customOAuth2UserService = customOAuth2UserService;
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain staticResourcesFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher(AntPathRequestMatcher.antMatcher(HttpMethod.GET, "/uploads/**"))
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Vẫn cần CORS
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(AbstractHttpConfigurer::disable)
                .securityContext(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .anonymous(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()
                );
        return http.build();
    }

    // *** SecurityFilterChain Chính cho API (Ưu tiên cao hơn - chạy sau) ***
    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(
            HttpSecurity http,
            AuthenticationSuccessHandler oAuth2LoginSuccessHandler // 👈 Inject ở đây
    ) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pets/species", "/api/pets/species/**", "/api/pets/{id:\\d+}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/shipping/**").permitAll()
                        .requestMatchers("/api/order/**").authenticated()
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/admin/pet").hasAnyAuthority("admin","staff")
                        .requestMatchers("/api/admin/**").hasAuthority("admin")
                        // Thêm các quy tắc authenticated khác nếu cần


                        // các endpoint cho payments
                        .requestMatchers(HttpMethod.POST, "/payment/payos_transfer_handler").permitAll()
                        .requestMatchers(HttpMethod.POST, "/order/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/order/{orderId}").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/order/{orderId}").authenticated()
                        .requestMatchers(HttpMethod.POST, "/order/confirm-webhook").permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2LoginSuccessHandler) // ✅ Sử dụng bean truyền vào
                );

        return http.build();
    }



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
        source.registerCorsConfiguration("/oauth2/**", configurationApi);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    @Bean
    public AuthenticationSuccessHandler oAuth2LoginSuccessHandler(OAuth2Service oAuth2Service) {
        return new OAuth2LoginSuccessHandler(oAuth2Service);
    }

}
