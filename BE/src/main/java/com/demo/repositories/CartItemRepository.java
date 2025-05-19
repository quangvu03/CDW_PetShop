package com.demo.repositories;

import com.demo.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByUserIdAndPetId(int userId, int petId);
    Optional<CartItem> findByUserIdAndProductId(int userId, int productId);
    List<CartItem> findAllByUserId(int userId);
    void deleteByUserIdAndPetId(int userId, int petId);
    void deleteByUserIdAndProductId(int userId, int productId);
    void deleteAllByUserId(int userId);


}
