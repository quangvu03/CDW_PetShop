package com.demo.services;

import com.demo.dtos.requests.AddCommentDto;
import com.demo.dtos.responses.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse addComment(AddCommentDto addCommentDto);

    List<CommentResponse> getCommentsByPetId(Integer petId);

    void deleteComment(Integer commentId);

    CommentResponse updateCommentReportStatus(Integer commentId);
}
