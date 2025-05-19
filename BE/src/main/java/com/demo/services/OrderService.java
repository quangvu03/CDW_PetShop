package com.demo.services;

import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderRequest;
import com.demo.entities.Order;

import java.util.List;

public interface OrderService {
    Order saveOrder(OrderRequest orderRequest);

    List<OrdersDto> findByUserIdOrderByOrderDateDesc(int userId);

    String UpdateOrderStatus(int orderId,String status);
}
