package com.demo.services;

import com.demo.entities.Review;
import java.util.List;

public interface ReviewService {
    void addReview(int userId, int petId, int rating, int orderId);

    List<Review> getReviewsByUserId(int userId);

    List<Review> getReviewsByPetId(int petId);

    void updateReview(int reviewId, int rating, int orderId);
}
