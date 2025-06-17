package com.demo.services;

import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderRequest;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.entities.Order;

import java.time.Instant;
import java.util.List;

public interface OrderService {
    Order saveOrder(OrderRequest orderRequest);

    List<OrdersDto> findByUserIdOrderByOrderDateDesc(int userId);

    OrdersDto updateOrder(UpdateOrderRequest updateOrderRequest);

    String cancelledOrder(int orderId);

    List<OrdersDto> findAllByOrderByOrderDateDesc();

    List<Order> findOrdersByStatus(String status);

    List<OrdersDto> findCompletedOrdersByDateRange(Instant startDate, Instant endDate);

    OrdersDto findById(int orderId);

    void updatePaymentStatus(int orderId, String status, Long payosOrderCode);

    void updatePaymentStatusByOrderId(int orderId, String status);

    void updatePaymentStatusByOrderCode(Long payosOrderCode, String status);

    // Thêm phương thức để cập nhật thông tin PayOS
    OrdersDto updatePayOSDetails(int orderId, String checkoutUrl, Instant expiredAt, Long payosOrderCode);
}