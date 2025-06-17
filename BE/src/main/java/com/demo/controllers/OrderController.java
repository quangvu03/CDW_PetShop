package com.demo.controllers;

import aj.org.objectweb.asm.TypeReference;
import com.demo.dtos.OrderItemDto;
import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.dtos.requests.OrderRequest;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.dtos.responses.ApiResponse;
import com.demo.entities.Order;
import com.demo.entities.OrderItem;
import com.demo.services.CartService;
import com.demo.services.OrderItemService;
import com.demo.services.OrderService;
import com.demo.services.ShippingService;
import com.demo.entities.ShippingMethod;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

    @Autowired
    private ShippingService shippingService;

    @PostMapping("/saveOrder")
    public ResponseEntity<?> saveOrder(@Valid @RequestBody OrderRequest orderRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(err -> err.getField() + ": " + err.getDefaultMessage())
                    .toList();
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            Order order = orderService.saveOrder(orderRequest);
            cartService.clearCartByUser(orderRequest.getUserId());
            List<OrderItem> listOrderItem = orderItemService.saveListOrderItem(orderRequest.getOrderRequestList(), order);

            if (!listOrderItem.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse(true, "Đặt hàng thành công"));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Đặt hàng thất bại"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi: " + e.getMessage()));
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

    @PutMapping("/cancelOrder")
    public ResponseEntity<?> cancelledOder(@RequestParam("orderId") int orderId) {
        try {
            String result = orderService.cancelledOrder(orderId);
            return result.equals("success")
                    ? ResponseEntity.ok(Map.of("result", result))
                    : ResponseEntity.badRequest().body(Map.of("result", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi: " + e.getMessage()));
        }
    }

    @PutMapping("/updateAddress")
    public ResponseEntity<?> updateAddress(@RequestParam("orderId") int orderId, @RequestParam("shippingAddress") String shippingAddress) {
        try {
            UpdateOrderRequest updateOrderRequest = new UpdateOrderRequest();
            updateOrderRequest.setOrderId(orderId);
            updateOrderRequest.setShippingAddress(shippingAddress);

            OrdersDto updatedOrder = orderService.updateOrder(updateOrderRequest);

            if (updatedOrder != null) {
                return ResponseEntity.ok(new ApiResponse(true, "Cập nhật địa chỉ giao hàng thành công"));
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Cập nhật địa chỉ giao hàng thất bại"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Lỗi: " + e.getMessage()));
        }
    }

    @GetMapping("/getAllShipping")
    public ResponseEntity<?> getAllShipping() {
        try {
            List<ShippingMethod> shippingMethods = shippingService.findAll();
            if (!shippingMethods.isEmpty()) {
                return ResponseEntity.ok(shippingMethods);
            } else {
                return ResponseEntity.ok(new ApiResponse(true, "Không có phương thức vận chuyển nào!"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Lỗi khi lấy danh sách phương thức vận chuyển: " + e.getMessage()));
        }
    }
}
