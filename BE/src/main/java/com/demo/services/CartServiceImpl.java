package com.demo.services;

import com.demo.dtos.CartItemDto;
import com.demo.dtos.PetDto;
import com.demo.dtos.ProductDto;
import com.demo.entities.CartItem;
import com.demo.entities.Pet;
import com.demo.entities.Product;
import com.demo.entities.User;
import com.demo.repositories.CartItemRepository;
import com.demo.repositories.PetRepository;
import com.demo.repositories.ProductRepository;
import com.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private PetRepository petRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    @Override
    public void addToCart(int userId, int productId, int petId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow();
        CartItem cartItem = null;

        if (petId > 0) {
            Pet pet = petRepository.findById(petId).orElseThrow();
            int existingQty = cartItemRepository.findByUserIdAndPetId(userId, petId)
                    .map(CartItem::getQuantity).orElse(0);

            if (existingQty + quantity > pet.getQuantity()) {
                throw new IllegalArgumentException("Số lượng vượt quá tồn kho.");
            }

            cartItem = cartItemRepository.findByUserIdAndPetId(userId, petId).orElse(null);
            if (cartItem == null) {
                cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setPet(pet);
                cartItem.setQuantity(quantity);
                cartItem.setCreatedAt(Instant.now());
            } else {
                cartItem.setQuantity(existingQty + quantity);
            }
        } else if (productId > 0) {
            Product product = productRepository.findById(productId).orElseThrow();
            cartItem = cartItemRepository.findByUserIdAndProductId(userId, productId).orElse(null);

            if (cartItem == null) {
                cartItem = new CartItem();
                cartItem.setUser(user);
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
                cartItem.setCreatedAt(Instant.now());
            } else {
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
            }
        } else {
            throw new IllegalArgumentException("Cần truyền petId hoặc productId");
        }
        cartItemRepository.save(cartItem);
    }

    public List<CartItemDto> getCartByUser(int userId) {
        List<CartItem> items = cartItemRepository.findAllByUserId(userId);

        return items.stream().map(item -> {
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setQuantity(item.getQuantity());

            if (item.getPet() != null) {
                dto.setPet(new PetDto(item.getPet()));
            }

            // ✅ Giữ lại để dùng sau, không gây lỗi nếu product đang null
//            if (item.getProduct() != null) {
//                try {
//                    dto.setProduct(new ProductDto(item.getProduct()));
//                } catch (Exception e) {
//                    // Log nếu cần
//                }
//            }

            return dto;
        }).collect(Collectors.toList());
    }


    public void removeFromCart(int userId, int productId, int petId) {
        if (petId > 0) {
            cartItemRepository.deleteByUserIdAndPetId(userId, petId);
        } else if (productId > 0) {
            cartItemRepository.deleteByUserIdAndProductId(userId, productId);
        } else {
            throw new RuntimeException("Không có petId hoặc productId để xoá");
        }
    }
    @Override
    public void updateQuantity(int userId, int itemId, int newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mục trong giỏ hàng"));

        // Bảo vệ: kiểm tra quyền user
        if (item.getUser() == null || item.getUser().getId() != userId) {
            throw new SecurityException("Không có quyền cập nhật mục này");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
    }
    @Transactional
    @Override
    public void clearCartByUser(int userId) {
        cartItemRepository.deleteAllByUserId(userId);
    }

}
