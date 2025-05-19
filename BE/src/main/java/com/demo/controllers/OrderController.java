package com.demo.controllers;

import aj.org.objectweb.asm.TypeReference;
import com.demo.dtos.OrderItemDto;
import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.dtos.requests.OrderRequest;
import com.demo.dtos.responses.ApiResponse;
import com.demo.entities.Order;
import com.demo.entities.OrderItem;
import com.demo.services.CartService;
import com.demo.services.OrderItemService;
import com.demo.services.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderItemService orderItemService;

    @PostMapping("/saveOrder")
    public ResponseEntity<?> saveOrder(@RequestBody OrderRequest orderRequest) {
        try {
            List<OrderItemRequest> orderItemRequestList = orderRequest.getOrderRequestList();

            Order order = orderService.saveOrder(orderRequest);
            cartService.clearCartByUser(orderRequest.getUserId());
            List<OrderItem> listOrderItem = orderItemService.saveListOrderItem(orderItemRequestList, order);
            if (!listOrderItem.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "Đặt hàng thành công"));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Đặt hàng thất bại"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getOrderByUser/{userId}")
    public ResponseEntity<?> saveOrder(@PathVariable("userId") int userId) {
        try {
            List<OrdersDto> ordersDtoList = orderService.findByUserIdOrderByOrderDateDesc(userId);

            if (!ordersDtoList.isEmpty()) {
                return ResponseEntity.ok(ordersDtoList);
            } else {
                return ResponseEntity.ok(new ApiResponse(true, "Bạn chưa có đơn đặt hàng nào!")); // Không có đơn hàng
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getDetailOder/{idOrder}")
    public ResponseEntity<?> getDetailOrder(@PathVariable("idOrder") int idOrder) {
        try {
            OrderItemDto orderItemDto = orderItemService.findOrderItemByOrderId(idOrder);
            return ResponseEntity.ok(Map.of("result", orderItemDto));
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


}