package com.demo.services;

import com.demo.dtos.OrderItemDto;
import com.demo.dtos.PetDto;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.entities.*;
import com.demo.repositories.CategoriesRepository;
import com.demo.repositories.OrderItemRepository;
import com.demo.repositories.OrderRepository;
import com.demo.repositories.PetRepository;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderItem> saveListOrderItem(List<OrderItemRequest> listOrderItemRequest, Order order) {
        if (listOrderItemRequest.isEmpty()) {
            throw new IllegalArgumentException("Danh sách sản phẩm trống");
        }
        List<OrderItem> list = new ArrayList<>();
        for (OrderItemRequest OrderItemRequest : listOrderItemRequest) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(null);
            orderItem.setPrice(OrderItemRequest.getPrice());
            orderItem.setQuantity(OrderItemRequest.getQuantity());
            Optional<Pet> petOptional = petRepository.findById(OrderItemRequest.getPetId());
            petOptional.ifPresent(orderItem::setPet);
            list.add(orderItem);
        }
        return orderItemRepository.saveAll(list);
    }

    @Override
    public OrderItemDto findOrderItemByOrderId(int idOrder) {
        Order order = orderRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy order"));
        List<PetDto> petDtos = orderItemRepository.findOrderItemsByOrderId(idOrder).stream()
                .map(item -> new PetDto(item.getPet()))
                .toList();
        return OrderItemDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .shippingName(order.getShippingMethod().getName())
                .priceShipping(order.getShippingMethod().getPrice())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .petDtoList(petDtos)
                .build();
    }

}
