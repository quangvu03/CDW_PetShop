package com.demo.controllers;

import com.demo.dtos.ReviewsDTO;
import com.demo.dtos.requests.ReviewRequest;
import com.demo.entities.Review;
import com.demo.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addReview(
            @RequestBody ReviewRequest reviewRequest) {

        reviewService.addReview(reviewRequest.getUserId(), reviewRequest.getPetId(), reviewRequest.getRating(), reviewRequest.getOrderId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getReview/{userId}")
    public ResponseEntity<List<ReviewsDTO>> getReviewsByUserId(@PathVariable int userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        List<ReviewsDTO> reviewsDTOs = reviews.stream()
                .map(review -> {
                    ReviewsDTO dto = new ReviewsDTO();
                    dto.setId(review.getId());
                    dto.setUserId(review.getUser().getId());
                    dto.setPetId(review.getPet().getId());
                    if (review.getOrder() != null) {
                        dto.setOrderId(review.getOrder().getId());
                    }
                    dto.setRating(review.getRating());
                    dto.setCreatedAt(review.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewsDTOs);
    }

    @GetMapping("/getReviewByPet/{petId}")
    public ResponseEntity<List<ReviewsDTO>> getReviewsByPetId(@PathVariable int petId) {
        List<Review> reviews = reviewService.getReviewsByPetId(petId);
        List<ReviewsDTO> reviewsDTOs = reviews.stream()
                .map(review -> {
                    ReviewsDTO dto = new ReviewsDTO();
                    dto.setId(review.getId());
                    dto.setUserId(review.getUser().getId());
                    dto.setPetId(review.getPet().getId());
                    if (review.getOrder() != null) {
                        dto.setOrderId(review.getOrder().getId());
                    }
                    dto.setRating(review.getRating());
                    dto.setCreatedAt(review.getCreatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(reviewsDTOs);
    }

    @PutMapping("update/{reviewId}")
    public ResponseEntity<Void> updateReview(
            @PathVariable int reviewId,
            @RequestBody ReviewRequest reviewRequest) {
        reviewService.updateReview(reviewId, reviewRequest.getRating(), reviewRequest.getOrderId());

        return ResponseEntity.ok().build();
    }
}
