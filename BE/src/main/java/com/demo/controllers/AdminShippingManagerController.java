package com.demo.controllers;

import com.demo.entities.ShippingMethod;
import com.demo.services.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminShippingManagerController {

    @Autowired
    private ShippingService shippingService;

    @GetMapping("/getAllShippingMethod")
    public ResponseEntity<?> getAllShippingMethods() {
        try {
            List<ShippingMethod> shippingMethods = shippingService.findAll();
            return ResponseEntity.ok(shippingMethods);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy danh sách phương thức vận chuyển: " + e.getMessage());
        }
    }

    @PostMapping("/addShipping")
    public ResponseEntity<?> addShippingMethod(@RequestBody ShippingMethod shippingMethod) {
        try {
            ShippingMethod savedShippingMethod = shippingService.save(shippingMethod);
            return ResponseEntity.ok(savedShippingMethod);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi thêm phương thức vận chuyển: " + e.getMessage());
        }
    }

    @GetMapping("/shipping/{id}")
    public ResponseEntity<?> getShippingMethodById(@PathVariable int id) {
        try {
            ShippingMethod shippingMethod = shippingService.findById(id);
            if (shippingMethod == null) {
                return ResponseEntity.status(404).body("Không tìm thấy phương thức vận chuyển với id: " + id);
            }
            return ResponseEntity.ok(shippingMethod);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy phương thức vận chuyển: " + e.getMessage());
        }
    }

    @PutMapping("/updateShipping/{id}")
    public ResponseEntity<?> updateShippingMethod(@PathVariable int id, @RequestBody ShippingMethod shippingMethod) {
        try {
            ShippingMethod updatedShippingMethod = shippingService.update(id, shippingMethod);
            return ResponseEntity.ok(updatedShippingMethod);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi cập nhật phương thức vận chuyển: " + e.getMessage());
        }
    }
}
