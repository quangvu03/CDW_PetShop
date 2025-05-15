package com.demo.controllers;

import com.demo.dtos.CartItemDto;
import com.demo.entities.CartItem;
import com.demo.services.CartService;
import com.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired private UserService userService;

    // ✅ Thêm vào giỏ hàng (pet hoặc product)
    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                          @RequestBody Map<String, Object> body) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();

        int petId = body.get("petId") != null ? Integer.parseInt(body.get("petId").toString()) : -1;
        int productId = body.get("productId") != null ? Integer.parseInt(body.get("productId").toString()) : -1;
        int quantity = Integer.parseInt(body.get("quantity").toString());

        cartService.addToCart(userId, productId, petId, quantity);
        return ResponseEntity.ok().build();
    }

    // ✅ Xem danh sách giỏ hàng
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();

        List<CartItemDto> items = cartService.getCartByUser(userId);
        return ResponseEntity.ok(items);
    }

    // ✅ Xoá khỏi giỏ hàng
    @DeleteMapping("/remove")
    @Transactional
    public ResponseEntity<Void> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestParam(defaultValue = "-1") int petId,
                                           @RequestParam(defaultValue = "-1") int productId) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();

        cartService.removeFromCart(userId, productId, petId);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update")
    public ResponseEntity<Void> updateQuantity(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody Map<String, Object> body) {
        String username = userDetails.getUsername();
        int userId = userService.findByUsername(username).getId();

        int itemId = Integer.parseInt(body.get("itemId").toString());
        int quantity = Integer.parseInt(body.get("quantity").toString());

        cartService.updateQuantity(userId, itemId, quantity);
        return ResponseEntity.ok().build();
    }

}
