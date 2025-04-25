package com.demo.services;

import com.demo.dtos.PetDto;
import com.demo.repositories.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.demo.entities.Pet;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.demo.entities.PetImage;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    @Autowired
    private PetRepository petRepository;

    @Transactional(readOnly = true)
    public List<PetDto> findAllPetsBySpecies(String species) { // Đổi tên và kiểu trả về
        // Gọi phương thức repository trả về List
        List<Pet> allPets = petRepository.findAllBySpeciesIgnoreCaseWithImages(species);

        // Chuyển đổi sang List<PetDTO>
        return allPets.stream()
                .map(this::convertToDto) // Dùng lại hàm convertToDto
                .collect(Collectors.toList());
    }

    // Giữ nguyên phương thức lấy danh sách loài
    @Transactional(readOnly = true)
    public List<String> getAllDistinctSpecies() {
        return petRepository.findAllDistinctSpecies();
    }

    private PetDto convertToDto(Pet pet) {
        if (pet == null) {
            return null;
        }
        PetDto dto = new PetDto();
        dto.setId(pet.getId());
        dto.setName(pet.getName());
        dto.setPrice(pet.getPrice());
        dto.setSpecies(pet.getSpecies());
        // ... set các trường khác ...

        String mainImageUrl = null;
        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
            // Ưu tiên tìm ảnh có isMain = true
            mainImageUrl = pet.getImages().stream()
                    // *** SỬA Ở ĐÂY: Kiểm tra giá trị Boolean isMain ***
                    // Dùng .filter(PetImage::getIsMain) nếu getter là getIsMain()
                    // Hoặc dùng .filter(img -> Boolean.TRUE.equals(img.getIsMain())) để an toàn hơn với null
                    .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                    .map(PetImage::getImageUrl) // Lấy imageUrl
                    .findFirst()               // Lấy cái đầu tiên tìm thấy
                    .orElse(null);             // Trả về null nếu không có ảnh nào isMain=true

            // Nếu không có ảnh chính (mainImageUrl vẫn là null), lấy ảnh đầu tiên làm fallback
            if (mainImageUrl == null) {
                mainImageUrl = pet.getImages().get(0).getImageUrl();
                System.out.println("Warning: Pet ID " + pet.getId() + " không có ảnh isMain=true, dùng ảnh đầu tiên: " + mainImageUrl);
            }
        } else {
            System.out.println("Warning: Pet ID " + pet.getId() + " không có ảnh nào.");
        }

        // Set đường dẫn tương đối vào DTO (sẽ là null nếu không có ảnh)
        dto.setImageUrl(mainImageUrl);

        return dto;
    }
}

