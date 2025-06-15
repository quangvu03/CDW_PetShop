package com.demo.repositories;

import com.demo.entities.Review;
import com.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByUserId(int userId);
    List<Review> findByPetId(int petId);
}
