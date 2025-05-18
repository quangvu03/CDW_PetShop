package com.demo.services;

import com.demo.dtos.OrderItemDto;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.entities.Order;
import com.demo.entities.OrderItem;

import java.util.List;

public interface OrderItemService {
     List<OrderItem> saveListOrderItem(List<OrderItemRequest> OrderItemRequest, Order idOrder);

     OrderItemDto findOrderItemByOrderId(int idOrder);
}
