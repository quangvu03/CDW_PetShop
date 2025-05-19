package com.demo.services;

import com.demo.dtos.OrderItemDto;
import com.demo.dtos.PetDto;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.entities.*;
import com.demo.repositories.CategoriesRepository;
import com.demo.repositories.OrderItemRepository;
import com.demo.repositories.OrderRepository;
import com.demo.repositories.PetRepository;
// import com.demo.repositories.ProductRepository; // Mở khi cần xử lý product
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private PetRepository petRepository;

    // @Autowired
    // private ProductRepository productRepository; // Mở khi cần xử lý product

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Lưu danh sách order item cho 1 đơn hàng.
     * Nếu là pet: petId > 0, productId = 0.
     * Nếu là product: productId > 0, petId = 0 (để mở rộng sau).
     * Luôn lưu giá tại thời điểm đặt hàng.
     */
    public List<OrderItem> saveListOrderItem(List<OrderItemRequest> listOrderItemRequest, Order order) {
        if (listOrderItemRequest == null || listOrderItemRequest.isEmpty()) {
            throw new IllegalArgumentException("Danh sách sản phẩm trống");
        }
        List<OrderItem> list = new ArrayList<>();
        for (OrderItemRequest orderItemRequest : listOrderItemRequest) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setPrice(orderItemRequest.getPrice());
            orderItem.setQuantity(orderItemRequest.getQuantity());

            // Xử lý cho pet
            if (orderItemRequest.getPetId() > 0) {
                Optional<Pet> petOptional = petRepository.findById(orderItemRequest.getPetId());
                petOptional.ifPresent(orderItem::setPet);
            }

            // // Xử lý cho product (mở khi cần)
            // if (orderItemRequest.getProductId() > 0) {
            //     Optional<Product> productOptional = productRepository.findById(orderItemRequest.getProductId());
            //     productOptional.ifPresent(orderItem::setProduct);
            // }

            list.add(orderItem);
        }
        return orderItemRepository.saveAll(list);
    }

    /**
     * Lấy thông tin chi tiết các item của 1 đơn hàng.
     */
    @Override
    public OrderItemDto findOrderItemByOrderId(int idOrder) {
        Order order = orderRepository.findById(idOrder)
                .orElseThrow(() -> new IllegalArgumentException("Lỗi: Không tìm thấy order"));
        List<PetDto> petDtos = orderItemRepository.findOrderItemsByOrderId(idOrder).stream()
                .map(item -> {
                    PetDto dto = new PetDto(item.getPet());
                    dto.setQuantity(item.getQuantity() != null ? item.getQuantity().intValue() : 0);
                    dto.setPrice(item.getPrice() != null ? item.getPrice().doubleValue() : 0.0);
                    return dto;
                })
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