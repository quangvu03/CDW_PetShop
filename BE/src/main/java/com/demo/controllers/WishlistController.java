package com.demo.controllers;

import com.demo.dtos.WishlistPetDto;
import com.demo.services.UserService;
import com.demo.services.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;
    @Autowired
    private UserService userService;

    // Lấy wishlist của user hiện tại
    @GetMapping("/user")
    public ResponseEntity<List<WishlistPetDto>> getWishlistByUser(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();
        List<WishlistPetDto> items = wishlistService.getWishlist(userId);
        return ResponseEntity.ok(items);
    }

    // Thêm pet vào wishlist
    @PostMapping("/pet/{petId}")
    public ResponseEntity<?> addPetToWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int petId) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();

        try {
            wishlistService.addPetToWishlist(userId, petId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        }
    }

    // Thêm product vào wishlist
    @PostMapping("/product/{productId}")
    public ResponseEntity<?> addProductToWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int productId) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();
        try {
            wishlistService.addProductToWishlist(userId, productId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        }
    }

    // Xoá pet khỏi wishlist
    @DeleteMapping("/pet/{petId}")
    public ResponseEntity<?> removePetToWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int petId) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();
        wishlistService.removePet(userId, petId);
        return ResponseEntity.ok().build();
    }

    // Xoá product khỏi wishlist
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<?> removeProductToWishlist(@AuthenticationPrincipal UserDetails userDetails, @PathVariable int productId) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();
        wishlistService.removeProduct(userId, productId);
        return ResponseEntity.ok().build();
    }
}