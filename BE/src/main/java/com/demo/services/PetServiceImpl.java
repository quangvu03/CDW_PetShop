package com.demo.services;

import com.demo.dtos.PetDto;
import com.demo.dtos.PetImageDto;
import com.demo.repositories.BrowsingHistoryRepository;
import com.demo.repositories.OrderItemRepository;
import com.demo.repositories.PetImageRepository;
import com.demo.repositories.PetRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.demo.entities.Pet;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import com.demo.entities.PetImage;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    @Autowired
    private PetRepository petRepository;

    @Autowired
    private PetImageRepository petImageRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private BrowsingHistoryRepository browsingHistoryRepository;

    @Transactional(readOnly = true)
    public List<PetDto> findAllPetsBySpecies(String species) {
        List<Pet> allPets = petRepository.findAllBySpeciesIgnoreCaseWithImages(species);
        return allPets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public List<String> getAllDistinctSpecies() {
        return petRepository.findAllDistinctSpecies();
    }

    @Override
    public PetDto findPetById(Integer id) {
        return petRepository.findById(id)
                .map(PetDto::new)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));
    }

    @Override
    public List<PetDto> findByName(String name) {
        List<Pet> petList = petRepository.findByNameContainingIgnoreCase(name);
        return petList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PetDto> findAll() {
        List<Pet> petList = petRepository.findAll();
        if (petList != null && !petList.isEmpty()) {
            return petList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Override
    public List<PetDto> findAllSortedByCreatedAtDesc() {
        List<Pet> petList = petRepository.findAllByOrderByCreatedAtDesc();
        if (petList != null && !petList.isEmpty()) {
            return petList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetDto> findBestSellingPets() {
        List<Object[]> results = orderItemRepository.findBestSellingPets();
        List<PetDto> bestSellingPets = new ArrayList<>();

        for (Object[] result : results) {
            Pet pet = (Pet) result[0];
            bestSellingPets.add(convertToDto(pet));
        }

        return bestSellingPets;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> findBestSellingPetsWithQuantitySold() {
        List<Object[]> results = orderItemRepository.findBestSellingPets();
        List<Map<String, Object>> bestSellingPetsWithQuantity = new ArrayList<>();

        for (Object[] result : results) {
            Pet pet = (Pet) result[0];
            Long quantitySold = (Long) result[1];

            Map<String, Object> petWithQuantity = new HashMap<>();
            petWithQuantity.put("pet", convertToDto(pet));
            petWithQuantity.put("quantitySold", quantitySold);

            bestSellingPetsWithQuantity.add(petWithQuantity);
        }

        return bestSellingPetsWithQuantity;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetDto> findMostViewedPets() {
        List<Object[]> results = browsingHistoryRepository.findMostViewedPets();
        List<PetDto> mostViewedPets = new ArrayList<>();

        for (Object[] result : results) {
            Pet pet = (Pet) result[0];
            mostViewedPets.add(convertToDto(pet));
        }

        return mostViewedPets;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> findMostViewedPetsWithViewCount() {
        List<Object[]> results = browsingHistoryRepository.findMostViewedPets();
        List<Map<String, Object>> mostViewedPetsWithViewCount = new ArrayList<>();

        for (Object[] result : results) {
            Pet pet = (Pet) result[0];
            Long viewCount = (Long) result[1];

            Map<String, Object> petWithViewCount = new HashMap<>();
            petWithViewCount.put("pet", convertToDto(pet));
            petWithViewCount.put("viewCount", viewCount);

            mostViewedPetsWithViewCount.add(petWithViewCount);
        }

        return mostViewedPetsWithViewCount;
    }

    @Override
    @Transactional
    public PetDto updatePet(Integer id, PetDto petDto) {
        Pet existingPet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + id));
        existingPet.setName(petDto.getName());
        existingPet.setSpecies(petDto.getSpecies());
        existingPet.setBreed(petDto.getBreed());
        existingPet.setPrice(petDto.getPrice());
        existingPet.setQuantity(petDto.getQuantity());
        existingPet.setGender(petDto.getGender());
        existingPet.setAge(petDto.getAge());
        existingPet.setColor(petDto.getColor());
        existingPet.setSize(petDto.getSize());
        existingPet.setOrigin(petDto.getOrigin());
        existingPet.setDescription(petDto.getDescription());
        existingPet.setStatus(petDto.getStatus());

        Pet updatedPet = petRepository.save(existingPet);
        PetDto dto = convertToDto(updatedPet);
//        dto.setImageUrls(updatedPet.getImages());

        return dto;
    }

    @Override
    @Transactional
    public PetDto addPetWithImage(PetDto petDto, MultipartFile imageFile) {
        try {
            // First save the pet
            Pet newPet = new Pet();
            newPet.setName(petDto.getName());
            newPet.setSpecies(petDto.getSpecies());
            newPet.setBreed(petDto.getBreed());
            newPet.setPrice(petDto.getPrice());
            newPet.setQuantity(petDto.getQuantity());
            newPet.setGender(petDto.getGender());
            newPet.setAge(petDto.getAge());
            newPet.setColor(petDto.getColor());
            newPet.setSize(petDto.getSize());
            newPet.setOrigin(petDto.getOrigin());
            newPet.setDescription(petDto.getDescription());
            newPet.setStatus(petDto.getStatus());
            newPet.setCreatedAt(java.time.Instant.now());

            Pet savedPet = petRepository.save(newPet);

            // Then add the image
            PetImage petImage = new PetImage();
            petImage.setPet(savedPet);
            petImage.setIsMain(true); // Set as main image

            if (savedPet.getImages() == null) {
                savedPet.setImages(new ArrayList<>());
            }

            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            String species = savedPet.getSpecies() != null ? savedPet.getSpecies().toLowerCase() : "other";
            Path uploadPath = Paths.get("uploads", "pets", species);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "uploads/pets/" + species + "/" + fileName;
            petImage.setImageUrl(imageUrl);
            savedPet.getImages().add(petImage);

            Pet updatedPet = petRepository.save(savedPet);

            return convertToDto(updatedPet);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage(), e);
        }
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
        dto.setBreed(pet.getBreed());
        dto.setGender(pet.getGender());
        dto.setAge(pet.getAge());
        dto.setColor(pet.getColor());
        dto.setSize(pet.getSize());
        dto.setDescription(pet.getDescription());
        dto.setOrigin(pet.getOrigin());
        dto.setStatus(pet.getStatus());
        dto.setQuantity(pet.getQuantity());
        String mainImageUrl = null;
        if (pet.getImages() != null && !pet.getImages().isEmpty()) {
            mainImageUrl = pet.getImages().stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsMain()))
                    .map(PetImage::getImageUrl)
                    .findFirst()
                    .orElse(null);
            if (mainImageUrl == null) {
                mainImageUrl = pet.getImages().get(0).getImageUrl();
                System.out.println("Warning: Pet ID " + pet.getId() + " không có ảnh isMain=true, dùng ảnh đầu tiên: " + mainImageUrl);
            }
        } else {
            System.out.println("Warning: Pet ID " + pet.getId() + " không có ảnh nào.");
        }

        dto.setImageUrl(mainImageUrl);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetImageDto> findAllImagesByPetId(Integer petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + petId));

        if (pet.getImages() == null || pet.getImages().isEmpty()) {
            return List.of();
        }

        return pet.getImages().stream()
                .map(PetImageDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PetImageDto addPetImage(Integer petId, MultipartFile imageFile) {
        try {
            Pet pet = petRepository.findById(petId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + petId));
            PetImage petImage = new PetImage();
            petImage.setPet(pet);
            petImage.setIsMain(false);

            if (Boolean.TRUE.equals(petImage.getIsMain()) && pet.getImages() != null) {
                pet.getImages().forEach(img -> img.setIsMain(false));
            }

            if (pet.getImages() == null) {
                pet.setImages(new ArrayList<>());
            }

            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            String species = pet.getSpecies() != null ? pet.getSpecies().toLowerCase() : "other";
            Path uploadPath = Paths.get("uploads", "pets", species);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "uploads/pets/" + species + "/" + fileName;
            petImage.setImageUrl(imageUrl);
            pet.getImages().add(petImage);
            Pet savedPet = petRepository.save(pet);

            PetImage savedImage = savedPet.getImages().stream()
                    .filter(img -> img.getImageUrl().equals(imageUrl))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Lỗi khi lưu ảnh thú cưng"));

            // Return a PetImageDto representing the saved entity
            return new PetImageDto(savedImage);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu ảnh: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public boolean deletePetImage(Integer imageId) {
        try {
            // Find the PetImage by ID
            PetImage petImage = petImageRepository.findById(imageId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh thú cưng với ID: " + imageId));

            // Get the image URL to delete the file from the server
            String imageUrl = petImage.getImageUrl();

            // Delete the PetImage from the database
            petImageRepository.deleteById(imageId);

            // Delete the image file from the server if it exists
            if (imageUrl != null && !imageUrl.isEmpty()) {
                try {
                    Path imagePath = Paths.get(imageUrl);
                    if (Files.exists(imagePath)) {
                        Files.delete(imagePath);
                    }
                } catch (IOException e) {
                    // Log the error but don't throw an exception
                    System.err.println("Lỗi khi xóa file ảnh: " + e.getMessage());
                    e.printStackTrace();
                    // Return true because the database record was deleted successfully
                    // even though the file deletion failed
                }
            }

            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa ảnh thú cưng: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public PetImageDto updateMainImage(Integer petId, Integer imageId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + petId));
        if (pet.getImages() == null || pet.getImages().isEmpty()) {
            throw new RuntimeException("Thú cưng không có ảnh nào.");
        }
        boolean found = false;
        for (PetImage img : pet.getImages()) {
            if (img.getId() == (imageId)) {
                img.setIsMain(true);
                found = true;
            } else {
                img.setIsMain(false);
            }
        }
        if (!found) {
            throw new RuntimeException("Không tìm thấy ảnh với ID: " + imageId);
        }
        petImageRepository.saveAll(pet.getImages());
        PetImage mainImage = pet.getImages().stream()
                .filter(img -> img.getId() == (imageId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh chính sau khi cập nhật."));
        return new PetImageDto(mainImage);
    }
}
