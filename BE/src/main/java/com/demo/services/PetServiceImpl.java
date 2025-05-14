package com.demo.services;

import com.demo.dtos.PetDto;
import com.demo.repositories.PetRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
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
}

