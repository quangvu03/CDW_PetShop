package com.demo.repositories;

import com.demo.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserIdOrderByOrderDateDesc(int userId);

    List<Order> findByStatus(String status);

    List<Order> findAllByOrderByOrderDateDesc();

    List<Order> findByStatusAndOrderDateBetweenOrderByOrderDateDesc(String status, Instant startDate, Instant endDate);

    @Modifying @Transactional
    @Query("UPDATE Order o SET o.status = 'cancelled' WHERE o.id = :orderId")
    int cancelledOrder(@Param("orderId") int orderId);

    Optional<Order> findByPayosOrderCode(Long payosOrderCode);


}
