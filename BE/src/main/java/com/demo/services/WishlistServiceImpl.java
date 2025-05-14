package com.demo.services;

import com.demo.dtos.WishlistPetDto;
import com.demo.entities.Pet;
import com.demo.entities.PetImage;
import com.demo.entities.Product;
import com.demo.entities.User;
import com.demo.entities.Wishlist;
import com.demo.repositories.PetRepository;
import com.demo.repositories.ProductRepository;
import com.demo.repositories.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private ProductRepository productRepository;
    @Override
    public List<WishlistPetDto> getWishlist(int userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(w -> {
                    Pet pet = w.getPet();
                    if (pet != null) {
                        WishlistPetDto dto = new WishlistPetDto();
                        dto.setId(pet.getId());
                        dto.setName(pet.getName());
                        dto.setPrice(pet.getPrice());
                        dto.setSpecies(pet.getSpecies());
                        dto.setBreed(pet.getBreed());
                        dto.setGender(pet.getGender());
                        dto.setAge(pet.getAge());
                        dto.setColor(pet.getColor());
                        dto.setSize(pet.getSize());
                        dto.setDescription(pet.getDescription());
                        dto.setOrigin(pet.getOrigin());
                        dto.setStatus(pet.getStatus());
                        dto.setQuantity(pet.getQuantity());
                        // Lấy imageUrl giống PetServiceImpl
                        String mainImageUrl = null;
                        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
                            mainImageUrl = pet.getImages().stream()
                                    .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                                    .map(PetImage::getImageUrl)
                                    .findFirst()
                                    .orElse(pet.getImages().get(0).getImageUrl());
                        }
                        dto.setImageUrl(mainImageUrl);
                        return dto;
                    }
                    // Nếu là product, bạn có thể làm tương tự với WishlistProductDto
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
    @Override
    public void addPetToWishlist(int userId, int petId) {
        if (!wishlistRepository.existsByUserIdAndPetId(userId, petId)) {
            User user = new User();
            user.setId(userId);
            Pet pet = new Pet();
            pet.setId(petId);

            wishlistRepository.save(new Wishlist(null, user, pet, null, Instant.now()));
        }else{
            throw new IllegalArgumentException("Sản phẩm đã có trong danh sách yêu thích");
        }
    }
    @Override
    public void addProductToWishlist(int userId, int productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            User user = new User();
            user.setId(userId);
            Product product = new Product();
            product.setId(productId);
            wishlistRepository.save(new Wishlist(null, user, null, product, Instant.now()));
        }else{
            throw new IllegalArgumentException("Sản phẩm đã có trong danh sách yêu thích");
        }
    }
    @Override
    @Transactional
    public void removePet(int userId, int petId) {
        wishlistRepository.deleteByUserIdAndPetId(userId, petId);
    }
    @Override
    @Transactional
    public void removeProduct(int userId, int productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}