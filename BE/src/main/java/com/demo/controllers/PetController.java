package com.demo.controllers;

import com.demo.dtos.PetDto;
import com.demo.services.PetService;
// Bỏ import Page, Pageable nếu không dùng cho endpoint này
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Dùng List

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*") // Hoặc cấu hình CORS tốt hơn
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    // --- SỬA ENDPOINT NÀY ---
    /**
     * Endpoint lấy TẤT CẢ Pet theo loài (cho Client-Side Pagination).
     * @param speciesName Tên loài từ path variable.
     * @return ResponseEntity chứa List<PetDTO>.
     */
    @GetMapping("/species/{speciesName}")
    public ResponseEntity<List<PetDto>> getAllPetsBySpecies( // Đổi tên và kiểu trả về
                                                             @PathVariable String speciesName
                                                             // Bỏ @RequestParam page, size
    ) {

        // Gọi service mới trả về List
        List<PetDto> petList = petService.findAllPetsBySpecies(speciesName);

        return ResponseEntity.ok(petList); // Trả về List
    }

    // Giữ nguyên endpoint lấy danh sách loài
    @GetMapping("/species")
    public ResponseEntity<List<String>> getAllSpecies() {
        List<String> speciesList = petService.getAllDistinctSpecies();
        return ResponseEntity.ok(speciesList);
    }

    // Bỏ hoặc comment out endpoint cũ dùng Pageable nếu không dùng nữa
    // public ResponseEntity<Page<PetDTO>> getPetsBySpeciesPaginated(...) { ... }
}