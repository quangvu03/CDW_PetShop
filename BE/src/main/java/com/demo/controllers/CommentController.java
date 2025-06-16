package com.demo.controllers;

import com.demo.dtos.requests.AddCommentDto;
import com.demo.dtos.responses.CommentResponse;
import com.demo.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/add")
    public ResponseEntity<CommentResponse> addComment(@RequestBody AddCommentDto addCommentDto) {
        if (addCommentDto.getUserId() == null || addCommentDto.getPetId() == null ||
            addCommentDto.getContent() == null || addCommentDto.getContent().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        CommentResponse commentResponse = commentService.addComment(addCommentDto);
        return new ResponseEntity<>(commentResponse, HttpStatus.CREATED);
    }


    @GetMapping("/getCommentByPet/{petId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPetId(@PathVariable Integer petId) {
        if (petId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<CommentResponse> comments = commentService.getCommentsByPetId(petId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer commentId) {
        if (commentId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            commentService.deleteComment(commentId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/report/{commentId}")
    public ResponseEntity<CommentResponse> reportComment(@PathVariable Integer commentId) {
        if (commentId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            CommentResponse updatedComment = commentService.updateCommentReportStatus(commentId);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/reported")
    public ResponseEntity<List<CommentResponse>> getAllReportedComments() {
        List<CommentResponse> reportedComments = commentService.getAllReportedComments();
        return new ResponseEntity<>(reportedComments, HttpStatus.OK);
    }

    @PutMapping("/unreport/{commentId}")
    public ResponseEntity<CommentResponse> unreportComment(@PathVariable Integer commentId) {
        if (commentId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            CommentResponse updatedComment = commentService.unreportComment(commentId);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
