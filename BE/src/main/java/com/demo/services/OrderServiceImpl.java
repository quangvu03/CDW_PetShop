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
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
        ZonedDateTime vietnamTime = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        order.setOrderDate(vietnamTime.toInstant()); // nếu vẫn lưu kiểu Instant
        order.setStatus("pending");
        order.setUser(user);
        order.setPaymentStatus("unpaid");
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setTotalPrice(orderRequest.getTotalPrice());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPhoneNumber(orderRequest.getPhoneNumber());
        order.setName(orderRequest.getShippingName());
        Optional<ShippingMethod> shippingMethodOptional = shippingRepository.findById(orderRequest.getShippingMethodId());
        if (shippingMethodOptional.isEmpty()) {
            throw new IllegalArgumentException("Lỗi phương thức vận chuyển");
        }
        order.setShippingMethod(shippingMethodOptional.get());
        return orderRepository.save(order);
    }

    @Override
    public List<OrdersDto> findByUserIdOrderByOrderDateDesc(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId).stream()
                .map(this::mapToOrdersDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDto updateOrder(UpdateOrderRequest updateRequest) {
        Optional<Order> existingOrderOpt = orderRepository.findById(updateRequest.getOrderId());
        if (existingOrderOpt.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }
        Order existingOrder = existingOrderOpt.get();
        if (updateRequest.getStatus() != null && !updateRequest.getStatus().isEmpty()) {
            String status = updateRequest.getStatus().toLowerCase();
            if (!isValidStatus(status)) {
                throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ");
            }
            existingOrder.setStatus(status);
        }
        if (updateRequest.getPaymentStatus() != null && !updateRequest.getPaymentStatus().isEmpty()) {
            String mappedStatus = "paid".equalsIgnoreCase(updateRequest.getPaymentStatus()) ? "paid" : "unpaid";
            existingOrder.setPaymentStatus(mappedStatus);
        }
        if (updateRequest.getTotalPrice() != null) {
            existingOrder.setTotalPrice(updateRequest.getTotalPrice());
        }
        if (updateRequest.getPaymentMethod() != null && !updateRequest.getPaymentMethod().isEmpty()) {
            existingOrder.setPaymentMethod(updateRequest.getPaymentMethod());
        }
        if (updateRequest.getShippingAddress() != null && !updateRequest.getShippingAddress().isEmpty()) {
            existingOrder.setShippingAddress(updateRequest.getShippingAddress());
        }
        if (updateRequest.getPhoneNumber() != null) {
            existingOrder.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if (updateRequest.getShippingName() != null) {
            existingOrder.setName(updateRequest.getShippingName());
        }
        if (updateRequest.getShippingMethodId() > 0) {
            Optional<ShippingMethod> shippingMethodOptional = shippingRepository.findById(updateRequest.getShippingMethodId());
            if (shippingMethodOptional.isEmpty()) {
                throw new IllegalArgumentException("Lỗi phương thức vận chuyển");
            }
            existingOrder.setShippingMethod(shippingMethodOptional.get());
        }
        Order savedOrder = orderRepository.save(existingOrder);
        return mapToOrdersDto(savedOrder);
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
        return rowUpdate > 0 ? "success" : "fail";
    }

    @Override
    public List<OrdersDto> findAllByOrderByOrderDateDesc() {
        return orderRepository.findAllByOrderByOrderDateDesc().stream()
                .map(this::mapToOrdersDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> findOrdersByStatus(String status) {
        if (!isValidStatus(status)) {
            throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ");
        }
        return orderRepository.findByStatus(status);
    }

    @Override
    public List<OrdersDto> findCompletedOrdersByDateRange(Instant startDate, Instant endDate) {
        return orderRepository.findByStatusAndOrderDateBetweenOrderByOrderDateDesc("completed", startDate, endDate)
                .stream()
                .map(this::mapToOrdersDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDto findById(int orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }
        return mapToOrdersDto(orderOptional.get());
    }

    @Override
    public void updatePaymentStatus(int orderId, String status, Long payosOrderCode) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }
        Order order = orderOptional.get();
        String mappedStatus = "PAID".equalsIgnoreCase(status) ? "paid" : "unpaid";
        order.setPaymentStatus(mappedStatus);
        if (payosOrderCode != null) {
            order.setPayosOrderCode(payosOrderCode);
        }
        orderRepository.save(order);
    }

    @Override
    public void updatePaymentStatusByOrderId(int orderId, String status) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }
        Order order = orderOptional.get();
        String mappedStatus = "PAID".equalsIgnoreCase(status) ? "paid" : "unpaid";
        order.setPaymentStatus(mappedStatus);
        if ("PAID".equalsIgnoreCase(status)) {
            order.setStatus("confirmed");
        } else if ("CANCELLED".equalsIgnoreCase(status)) {
            order.setStatus("cancelled");
        }
        orderRepository.save(order);
    }

    @Override
    public void updatePaymentStatusByOrderCode(Long payosOrderCode, String status) {
        Optional<Order> orderOptional = orderRepository.findByPayosOrderCode(payosOrderCode);
        if (orderOptional.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng với PayOS order code không tồn tại");
        }
        Order order = orderOptional.get();
        String mappedStatus = "PAID".equalsIgnoreCase(status) ? "paid" : "unpaid";
        order.setPaymentStatus(mappedStatus);
        if ("PAID".equalsIgnoreCase(status)) {
            order.setStatus("confirmed");
        } else if ("CANCELLED".equalsIgnoreCase(status)) {
            order.setStatus("cancelled");
        }
        orderRepository.save(order);
    }

    @Override
    public OrdersDto updatePayOSDetails(int orderId, String checkoutUrl, Instant expiredAt, Long payosOrderCode) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isEmpty()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại");
        }
        Order order = orderOptional.get();
        order.setCheckoutUrl(checkoutUrl);
        order.setExpiredAt(expiredAt);
        order.setPayosOrderCode(payosOrderCode);
        order.setPaymentStatus("unpaid");
        Order savedOrder = orderRepository.save(order);
        return mapToOrdersDto(savedOrder);
    }

    private OrdersDto mapToOrdersDto(Order order) {
        OrdersDto dto = new OrdersDto();
        dto.setId(order.getId());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingName(order.getName());
        dto.setPhoneNumber(order.getPhoneNumber());
        dto.setCheckoutUrl(order.getCheckoutUrl());
        dto.setExpiredAt(order.getExpiredAt());
        return dto;
    }

    private boolean isValidStatus(String status) {
        return status.equals("pending") ||
                status.equals("confirmed") ||
                status.equals("shipped") ||
                status.equals("completed") ||
                status.equals("cancelled");
    }
}