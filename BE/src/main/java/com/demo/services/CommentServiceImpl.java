package com.demo.services;

import com.demo.dtos.CommentsDto;
import com.demo.dtos.requests.AddCommentDto;
import com.demo.dtos.responses.CommentResponse;
import com.demo.entities.Comment;
import com.demo.entities.Pet;
import com.demo.entities.User;
import com.demo.repositories.CommentRepository;
import com.demo.repositories.PetRepository;
import com.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, 
                             UserRepository userRepository,
                             PetRepository petRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
    }

    @Override
    public CommentResponse addComment(AddCommentDto addCommentDto) {
        User user = userRepository.findById(addCommentDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pet pet = petRepository.findById(addCommentDto.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPet(pet);
        comment.setContent(addCommentDto.getContent());
        comment.setCreatedAt(Instant.now());
        comment.setIsReported(false);

        if (addCommentDto.getParentId() != null) {
            Comment parentComment = commentRepository.findById(addCommentDto.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParent(parentComment);
        }
        Comment savedComment = commentRepository.save(comment);
        CommentResponse response = new CommentResponse();
        response.setId(savedComment.getId());
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setAvatarUser(user.getAvatar());
        response.setPetId(pet.getId());
        response.setContent(savedComment.getContent());
        response.setCreatedAt(savedComment.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
        if (savedComment.getParent() != null) {
            response.setParentId(savedComment.getParent().getId());
        }

        // Initialize empty list for replies (a new comment won't have replies yet)
        response.setCommentsResponses(new ArrayList<>());

        return response;
    }

    @Override
    public List<CommentResponse> getCommentsByPetId(Integer petId) {
        petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        List<Comment> comments = commentRepository.findByPetId(petId);

        return comments.stream()
                .map(comment -> {
                    CommentResponse response = new CommentResponse();
                    response.setId(comment.getId());
                    response.setUserId(comment.getUser().getId());
                    response.setUsername(comment.getUser().getUsername());
                    response.setAvatarUser(comment.getUser().getAvatar());
                    response.setPetId(comment.getPet().getId());
                    response.setContent(comment.getContent());
                    response.setCreatedAt(comment.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
                    if (comment.getParent() != null) {
                        response.setParentId(comment.getParent().getId());
                    }

                    // Get replies for this comment
                    List<Comment> replies = commentRepository.findByParentId(comment.getId());
                    if (!replies.isEmpty()) {
                        List<CommentsDto> replyDtos = replies.stream()
                                .map(this::mapToCommentsDto)
                                .collect(Collectors.toList());
                        response.setCommentsResponses(replyDtos);
                    } else {
                        response.setCommentsResponses(new ArrayList<>());
                    }

                    return response;
                })
                .collect(Collectors.toList());
    }

    private CommentsDto mapToCommentsDto(Comment comment) {
        CommentsDto dto = new CommentsDto();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUsername(comment.getUser().getUsername());
        dto.setAvatarUser(comment.getUser().getAvatar());
        dto.setPetId(comment.getPet().getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
        if (comment.getIsReported() != null) {
            dto.setIsReported(comment.getIsReported() ? (byte) 1 : (byte) 0);
        }
        if (comment.getParent() != null) {
            dto.setParentId(comment.getParent().getId());
        }
        return dto;
    }

    @Override
    @Transactional
    public void deleteComment(Integer commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Delete all replies to this comment first
        List<Comment> replies = commentRepository.findByParentId(commentId);
        for (Comment reply : replies) {
            // Recursively delete any nested replies
            deleteComment(reply.getId());
        }

        // Delete the comment itself
        commentRepository.deleteById(commentId);
    }

    @Override
    public CommentResponse updateCommentReportStatus(Integer commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Update isReported to true (1)
        comment.setIsReported(true);
        Comment updatedComment = commentRepository.save(comment);

        // Create response
        CommentResponse response = new CommentResponse();
        response.setId(updatedComment.getId());
        response.setUserId(updatedComment.getUser().getId());
        response.setUsername(updatedComment.getUser().getUsername());
        response.setAvatarUser(updatedComment.getUser().getAvatar());
        response.setPetId(updatedComment.getPet().getId());
        response.setContent(updatedComment.getContent());
        response.setCreatedAt(updatedComment.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
        response.setIsReported((byte) 1);

        if (updatedComment.getParent() != null) {
            response.setParentId(updatedComment.getParent().getId());
        }

        // Get replies for this comment
        List<Comment> replies = commentRepository.findByParentId(updatedComment.getId());
        if (!replies.isEmpty()) {
            List<CommentsDto> replyDtos = replies.stream()
                    .map(this::mapToCommentsDto)
                    .collect(Collectors.toList());
            response.setCommentsResponses(replyDtos);
        } else {
            response.setCommentsResponses(new ArrayList<>());
        }

        return response;
    }
}
