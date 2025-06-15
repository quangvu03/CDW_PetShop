package com.demo.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentsDto {
    private Integer id;
    private Integer userId;
    private String username;
    private String avatarUser;
    private Integer petId;
    private Integer parentId;
    private String content;
    private Byte isReported;
    private LocalDateTime createdAt;

}
