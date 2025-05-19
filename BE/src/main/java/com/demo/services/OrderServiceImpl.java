package com.demo.services;

import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderRequest;
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
        order.setPaymentStatus(orderRequest.getPaymentStatus());
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
                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Override
    public String UpdateOrderStatus(int orderId, String status) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            return  "Lỗi: Order không tồn tại!";
        }
        if (!order.get().getStatus().equals("pending") && status.equals("cancelled")) {
            return "Lỗi: Không thể hủy các đơn hàng đã được xác nhận!";
        }
        int rowUpdate = orderRepository.updateOrderStatus(orderId, status);
        if (rowUpdate > 0) {
            return "success";
        } else {
            return "fail";
        }
    }

}
