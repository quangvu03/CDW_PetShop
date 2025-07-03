package com.demo.controllers;

import com.demo.dtos.OrderItemDto;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.entities.Order;
import com.demo.services.OrderItemService;
import com.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminOrderManagerController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderItemService orderItemService;



    @GetMapping("findAllOrder")
    public ResponseEntity<?> findAllPet() {
        try {
            return ResponseEntity.ok(orderService.findAllByOrderByOrderDateDesc());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy danh sách thú cưng: " + e.getMessage());
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

    @GetMapping("/getCompletedOrders")
    public ResponseEntity<?> getCompletedOrders() {
        try {
            List<OrderItemDto> completedOrders = new ArrayList<>();
            List<Order> orders = orderService.findOrdersByStatus("completed");

            for (Order order : orders) {
                OrderItemDto orderItemDto = orderItemService.findOrderItemByOrderId(order.getId());
                completedOrders.add(orderItemDto);
            }

            return ResponseEntity.ok(completedOrders);
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/getCompletedOrdersByDateRange")
    public ResponseEntity<?> getCompletedOrdersByDateRange(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            // Convert LocalDate to Instant (start of day for startDate, end of day for endDate)
            Instant startInstant = startDate.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant endInstant = endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            return ResponseEntity.ok(orderService.findCompletedOrdersByDateRange(startInstant, endInstant));
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
