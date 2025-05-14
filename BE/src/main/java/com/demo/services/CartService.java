package com.demo.services;

import com.demo.dtos.CartItemDto;
import com.demo.entities.CartItem;

import java.util.List;

public interface CartService {
    public void addToCart(int userId, int productId, int petId, int quantity);
    public void removeFromCart(int userId, int productId, int petId);
    public List<CartItemDto> getCartByUser(int userId);
    void updateQuantity(int userId, int itemId, int newQuantity);


}
