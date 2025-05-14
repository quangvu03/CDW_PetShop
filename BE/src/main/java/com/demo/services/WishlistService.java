package com.demo.services;

import com.demo.dtos.WishlistPetDto;

import java.util.List;

public interface WishlistService {
    List<WishlistPetDto> getWishlist(int userId);
    void addPetToWishlist(int userId, int petId);
    void addProductToWishlist(int userId, int productId);
    void removePet(int userId, int petId);
    void removeProduct(int userId, int productId);
}
