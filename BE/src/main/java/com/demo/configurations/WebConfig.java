package com.demo.configurations;

// import org.springframework.context.annotation.Bean; // Không cần nếu xóa bean CORS
import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry; // Không cần nếu xóa bean CORS
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // --- ĐẢM BẢO PHẦN NÀY ĐÃ ĐƯỢC COMMENT OUT HOẶC XÓA ---
    /*
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
    */
    // --- KẾT THÚC PHẦN COMMENT OUT/XÓA ---

    // *** GIỮ LẠI PHẦN NÀY ***
    // Cấu hình để phục vụ file tĩnh từ thư mục 'uploads' khi truy cập URL /uploads/**
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Khi browser gọi /uploads/abc/xyz.jpg
        registry.addResourceHandler("/uploads/**")
                // Server sẽ tìm file trong thư mục uploads ở gốc dự án
                .addResourceLocations("file:uploads/");
        // Đảm bảo thư mục 'uploads' tồn tại ở cấp gốc của dự án Spring Boot
        // và tiến trình Java có quyền đọc từ thư mục này.
    }
}