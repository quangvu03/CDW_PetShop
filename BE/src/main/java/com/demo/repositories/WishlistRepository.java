package com.demo.repositories;

import com.demo.entities.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUserId(int id);
    boolean existsByUserIdAndPetId(int userId, int petId);
    boolean existsByUserIdAndProductId(int userId, int productId);
    void deleteByUserIdAndPetId(int userId, int petId);
    void deleteByUserIdAndProductId(int userId, int productId);
}
