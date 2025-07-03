package com.demo.controllers;

import com.demo.dtos.UsersDto;
import com.demo.entities.BrowsingHistory;
import com.demo.entities.User;
import com.demo.services.BrowsingHistoryService;
import com.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/browsing-history")
public class BrowsingHistoryController {

    @Autowired
    private BrowsingHistoryService browsingHistoryService;

    @Autowired
    private UserService userService;


    @PostMapping("/add/pet")
    public ResponseEntity<?> addPetBrowsingHistory(
            @RequestParam int userId, @RequestParam int petId) {
        try {
            UsersDto user = userService.findById(userId);

            if (user == null) {
                return ResponseEntity.badRequest().body("Người dùng không tồn tại");
            }

            browsingHistoryService.addBrowsingHistoryForPet(userId, petId);
            return ResponseEntity.ok("done");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getBrowsingHistory(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            int userId = userService.findByUsername(username).getId();

            List<BrowsingHistory> history = browsingHistoryService.getBrowsingHistoryByUser(userId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Get browsing history for a specific pet
     */
    @GetMapping("/pet/{petId}")
    public ResponseEntity<?> getBrowsingHistoryByPet(@PathVariable int petId) {
        try {
            List<BrowsingHistory> history = browsingHistoryService.getBrowsingHistoryByPet(petId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * Delete all browsing history for the current user
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearBrowsingHistory(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            String username = userDetails.getUsername();
            int userId = userService.findByUsername(username).getId();

            browsingHistoryService.deleteBrowsingHistoryByUser(userId);
            return ResponseEntity.ok("Đã xóa lịch sử duyệt của người dùng");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
