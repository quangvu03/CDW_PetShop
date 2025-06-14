package com.demo.controllers;

import com.demo.dtos.OrderItemDto;
import com.demo.dtos.requests.UpdateOrderRequest;
import com.demo.services.OrderItemService;
import com.demo.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            if( paymentStatus != null && !paymentStatus.isEmpty()) {
                updateRequest.setPaymentStatus(paymentStatus);
            }
            return ResponseEntity.ok(Map.of("result", orderService.updateOrder(updateRequest)));
        } catch (Exception e) {
            return new ResponseEntity<>("Lỗi: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
