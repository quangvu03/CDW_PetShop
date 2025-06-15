package com.demo.dtos.responses;

import com.demo.dtos.CommentsDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data

public class CommentResponse {
    private Integer id;
    private Integer userId;
    private String username;
    private String avatarUser;
    private Integer petId;
    private Integer parentId;
    private String content;
    private Byte isReported;
    private LocalDateTime createdAt;
    List<CommentsDto> commentsResponses;
}
