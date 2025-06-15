package com.demo.dtos.requests;

import lombok.Data;

@Data
public class AddCommentDto {
    private Integer userId;
    private Integer petId;
    private String content;
    private Integer parentId;
}
