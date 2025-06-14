package com.demo.services;

import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderRequest;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.entities.Order;
import com.demo.entities.ShippingMethod;
import com.demo.entities.User;
import com.demo.repositories.OrderRepository;
import com.demo.repositories.ShippingRepository;
import com.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    ShippingRepository shippingRepository;

    @Override
    public Order saveOrder(OrderRequest orderRequest) {

        Optional<User> optionalUser = userRepository.findById(orderRequest.getUserId());
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("User không tồn tại");
        }
        User user = optionalUser.get();
        Order order = new Order();
        order.setOrderDate(Instant.now());
        order.setStatus("pending");
        order.setUser(user);
        order.setPaymentStatus("unpaid");
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        Optional<ShippingMethod> shippingMethodOptional = shippingRepository.findById(orderRequest.getShippingMethodId());
        if (shippingMethodOptional.isEmpty()) {
            throw new IllegalArgumentException("Lỗi phương thức vận chuyển (OrderServiceImpl 46)");

        }
        order.setShippingMethod(shippingMethodOptional.get());

        return orderRepository.save(order);
    }

    @Override
    public List<OrdersDto> findByUserIdOrderByOrderDateDesc(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));

        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(order -> {
                    OrdersDto dto = new OrdersDto();
                    dto.setId(order.getId());
                    dto.setStatus(order.getStatus());
                    dto.setOrderDate(order.getOrderDate());
                    dto.setTotalPrice(order.getTotalPrice());
                    dto.setPaymentMethod(order.getPaymentMethod());
                    dto.setPaymentStatus(order.getPaymentStatus());
                    dto.setShippingAddress(order.getShippingAddress());
                    dto.setShippingName(order.getShippingMethod() != null ? order.getShippingMethod().getName() : "");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDto updateOrder(UpdateOrderRequest updateRequest) {
        // Find the existing order
        Optional<Order> existingOrderOpt = orderRepository.findById(updateRequest.getOrderId());
        if (existingOrderOpt.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }

        Order existingOrder = existingOrderOpt.get();

        // Update status if provided
        if (updateRequest.getStatus() != null && !updateRequest.getStatus().isEmpty()) {
            String status = updateRequest.getStatus().toLowerCase();
            if (!isValidStatus(status)) {
                throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ");
            }
            existingOrder.setStatus(status);
        }

        if (updateRequest.getPaymentStatus() != null && !updateRequest.getPaymentStatus().isEmpty()) {
            existingOrder.setPaymentStatus(updateRequest.getPaymentStatus());
        }

        if (updateRequest.getTotalPrice() != null) {
            existingOrder.setTotalPrice(updateRequest.getTotalPrice());
        }

        // Update payment method if provided
        if (updateRequest.getPaymentMethod() != null && !updateRequest.getPaymentMethod().isEmpty()) {
            existingOrder.setPaymentMethod(updateRequest.getPaymentMethod());
        }

        // Update shipping address if provided
        if (updateRequest.getShippingAddress() != null && !updateRequest.getShippingAddress().isEmpty()) {
            existingOrder.setShippingAddress(updateRequest.getShippingAddress());
        }

        // Update shipping method if provided
        if (updateRequest.getShippingMethodId() > 0) {
            Optional<ShippingMethod> shippingMethodOptional = shippingRepository.findById(updateRequest.getShippingMethodId());
            if (shippingMethodOptional.isEmpty()) {
                throw new IllegalArgumentException("Lỗi phương thức vận chuyển");
            }
            existingOrder.setShippingMethod(shippingMethodOptional.get());
        }

        Order savedOrder = orderRepository.save(existingOrder);

        // Convert Order to OrdersDto
        OrdersDto dto = new OrdersDto();
        dto.setId(savedOrder.getId());
        dto.setStatus(savedOrder.getStatus());
        dto.setOrderDate(savedOrder.getOrderDate());
        dto.setTotalPrice(savedOrder.getTotalPrice());
        dto.setPaymentMethod(savedOrder.getPaymentMethod());
        dto.setPaymentStatus(savedOrder.getPaymentStatus());
        dto.setShippingAddress(savedOrder.getShippingAddress());
        dto.setShippingName(savedOrder.getShippingMethod() != null ? savedOrder.getShippingMethod().getName() : "");

        return dto;
    }

    @Override
    public String cancelledOrder(int orderId) {
        Optional<Order> order = orderRepository.findById(orderId);

        if (order.isEmpty()) {
            throw new IllegalArgumentException("Lỗi: Order không tồn tại!");
        }

        if (!order.get().getStatus().equals("pending")) {
            throw new IllegalArgumentException("Không thể hủy các đơn hàng đã được xác nhận");
        }

        int rowUpdate = orderRepository.cancelledOrder(orderId);
        if (rowUpdate > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

    @Override
    public List<OrdersDto> findAllByOrderByOrderDateDesc() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(order -> {
                    OrdersDto dto = new OrdersDto();
                    dto.setId(order.getId());
                    dto.setStatus(order.getStatus());
                    dto.setOrderDate(order.getOrderDate());
                    dto.setTotalPrice(order.getTotalPrice());
                    dto.setPaymentMethod(order.getPaymentMethod());
                    dto.setPaymentStatus(order.getPaymentStatus());
                    dto.setShippingAddress(order.getShippingAddress());
                    dto.setShippingName(order.getShippingMethod() != null ? order.getShippingMethod().getName() : "");
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private boolean isValidStatus(String status) {
        return status.equals("pending") ||
                status.equals("confirmed") ||
                status.equals("shipped") ||
                status.equals("completed") ||
                status.equals("cancelled");
    }


}
