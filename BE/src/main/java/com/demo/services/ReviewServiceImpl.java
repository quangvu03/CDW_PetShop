package com.demo.services;

import com.demo.entities.Order;
import com.demo.entities.Pet;
import com.demo.entities.Review;
import com.demo.entities.User;
import com.demo.repositories.OrderRepository;
import com.demo.repositories.PetRepository;
import com.demo.repositories.ReviewRepository;
import com.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;
    private final OrderRepository orderRepository;;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, UserRepository userRepository, PetRepository petRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void addReview(int userId, int petId, int rating, int orderId ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + petId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + petId));

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setUser(user);
        review.setPet(pet);
        review.setRating(rating);
        review.setCreatedAt(Instant.now());
        review.setOrder(order);

        reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByUserId(int userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Return all reviews by this user
        return reviewRepository.findByUserId(userId);
    }

    @Override
    public List<Review> getReviewsByPetId(int petId) {
        // Verify pet exists
        petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Pet not found with id: " + petId));

        // Return all reviews for this pet
        return reviewRepository.findByPetId(petId);
    }

    @Override
    @Transactional
    public void updateReview(int reviewId, int rating, int orderId) {
        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // Find the review
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        // Find the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Update the rating and order
        review.setRating(rating);
        review.setOrder(order);

        // Save the updated review
        reviewRepository.save(review);
    }
}
