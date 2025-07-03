package com.demo.repositories;

import com.demo.entities.OrderItem;
import com.demo.entities.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findOrderItemsByOrderId(int idOrder);

    @Query("SELECT oi.pet, SUM(oi.quantity) as totalSold FROM OrderItem oi WHERE oi.pet IS NOT NULL GROUP BY oi.pet ORDER BY totalSold DESC")
    List<Object[]> findBestSellingPets();

}
