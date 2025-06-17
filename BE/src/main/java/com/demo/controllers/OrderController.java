package com.demo.controllers;
import com.demo.dtos.OrderItemDto;
import com.demo.dtos.OrdersDto;
import com.demo.dtos.requests.CreatePaymentLinkRequest;
import com.demo.dtos.requests.OrderItemRequest;
import com.demo.dtos.requests.OrderRequest;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.dtos.responses.ApiResponse;
import com.demo.entities.Order;
import com.demo.entities.OrderItem;
import com.demo.entities.ShippingMethod;
import com.demo.services.CartService;
import com.demo.services.OrderItemService;
import com.demo.services.OrderService;
import com.demo.services.ShippingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;

import java.time.Instant;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final CartService cartService;
    private final OrderItemService orderItemService;
    private final ShippingService shippingService;
    private final PayOS payOS;
    private final ObjectMapper objectMapper;

    @Autowired
    public OrderController(OrderService orderService, CartService cartService,
                           OrderItemService orderItemService, ShippingService shippingService,
                           PayOS payOS, ObjectMapper objectMapper) {
        this.orderService = orderService;
        this.cartService = cartService;
        this.orderItemService = orderItemService;
        this.shippingService = shippingService;
        this.payOS = payOS;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/saveOrder")
    public ResponseEntity<?> saveOrder(@Valid @RequestBody OrderRequest orderRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getFieldErrors().stream()
                    .map(err -> err.getField() + ": " + err.getDefaultMessage())
                    .toList();
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            List<OrderItemRequest> orderItemRequestList = orderRequest.getOrderRequestList();
            Order order = orderService.saveOrder(orderRequest);
            cartService.clearCartByUser(orderRequest.getUserId());
            List<OrderItem> listOrderItem = orderItemService.saveListOrderItem(orderRequest.getOrderRequestList(), order);

            if (!listOrderItem.isEmpty()) {
                if ("PAYOS".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
                    Map<String, Object> body = new HashMap<>();
                    body.put("success", true);
                    body.put("message", "Đơn hàng đã được tạo, cần tạo liên kết thanh toán");
                    body.put("data", Map.of("orderId", order.getId()));
                    return ResponseEntity.ok(body);
                } else {
                    return ResponseEntity.ok(new ApiResponse(true, "Đặt hàng thành công"));
                }
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Đặt hàng thất bại"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Lỗi: " + e.getMessage()));
        }
    }


    @GetMapping("/getOrderByUser/{userId}")
    public ResponseEntity<?> getOrderByUser(@PathVariable("userId") int userId) {
        try {
            List<OrdersDto> ordersDtoList = orderService.findByUserIdOrderByOrderDateDesc(userId);
            if (!ordersDtoList.isEmpty()) {
                return ResponseEntity.ok(ordersDtoList);
            } else {
                return ResponseEntity.ok(new ApiResponse(true, "Bạn chưa có đơn đặt hàng nào!"));
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getDetailOder/{idOrder}")
    public ResponseEntity<?> getDetailOrder(@PathVariable("idOrder") int idOrder) {
        try {
            OrderItemDto orderItemDto = orderItemService.findOrderItemByOrderId(idOrder);
            OrdersDto orderDto = orderService.findById(idOrder);
            return ResponseEntity.ok(Map.of("result", orderItemDto, "order", orderDto));
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
            return updatedOrder != null
                    ? ResponseEntity.ok(new ApiResponse(true, "Cập nhật địa chỉ giao hàng thành công"))
                    : ResponseEntity.badRequest().body(new ApiResponse(false, "Cập nhật địa chỉ giao hàng thất bại"));
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

    @PostMapping("/createPaymentLink")
    public ResponseEntity<?> createPaymentLink(@RequestBody CreatePaymentLinkRequest request) {
        ObjectNode response = objectMapper.createObjectNode();
        try {
            OrdersDto order = orderService.findById(request.getOrderId());
            if (order == null) {
                response.put("error", -1);
                response.put("message", "Đơn hàng không tồn tại");
                response.set("data", null);
                return ResponseEntity.badRequest().body(response);
            }

            String currentTimeString = String.valueOf(System.currentTimeMillis());
            long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

            ItemData item = ItemData.builder()
                    .name(request.getProductName())
                    .price(request.getPrice())
                    .quantity(1)
                    .build();

            // Sử dụng múi giờ UTC+7 để tính toán thời gian
            Instant now = Instant.now().atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
            long expiryTimeInSeconds = now.getEpochSecond() + 6 * 60 * 60; // 6 giờ

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCode)
                    .description(request.getDescription())
//                    .amount(request.getPrice())
                    .amount(2000)
                    .item(item)
                    .returnUrl(request.getReturnUrl())
                    .cancelUrl(request.getCancelUrl())
                    .expiredAt(expiryTimeInSeconds)
                    .build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);

            OrdersDto updatedOrder = orderService.updatePayOSDetails(
                    request.getOrderId(),
                    data.getCheckoutUrl(),
                    Instant.ofEpochSecond(data.getExpiredAt()),
                    orderCode
            );

            response.put("error", 0);
            response.put("message", "Tạo liên kết thanh toán thành công");
            response.set("data", objectMapper.valueToTree(data));
            response.set("order", objectMapper.valueToTree(updatedOrder));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", -1);
            response.put("message", "Lỗi: " + e.getMessage());
            response.set("data", null);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/updateOrderStatus")
    public ResponseEntity<?> updateOrderStatus(@RequestParam("orderId") int orderId,
                                               @RequestParam("status") String status,
                                               @RequestParam(value = "paymentStatus", required = false) String paymentStatus) {
        try {
            UpdateOrderRequest updateRequest = new UpdateOrderRequest();
            updateRequest.setOrderId(orderId);
            updateRequest.setStatus(status);
            if(paymentStatus != null && !paymentStatus.isEmpty()) {
                // Map the status to one of the allowed values for the payment_status ENUM column
                String mappedStatus;
                if ("paid".equalsIgnoreCase(paymentStatus) ||
                        "PAID".equalsIgnoreCase(paymentStatus)) {
                    mappedStatus = "paid";
                } else {
                    // For any other status, use "unpaid"
                    mappedStatus = "unpaid";
                }
                updateRequest.setPaymentStatus(mappedStatus);
            }
            return ResponseEntity.ok(Map.of("result", orderService.updateOrder(updateRequest)));
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
