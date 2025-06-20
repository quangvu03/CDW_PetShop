package com.demo.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddCommentDto {

    private Integer userId;

    private Integer petId;

    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;

    private Integer parentId;
}
