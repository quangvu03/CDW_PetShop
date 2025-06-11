package com.demo.controllers;

import com.demo.dtos.PetDto;
import com.demo.dtos.PetImageDto;
import com.demo.services.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminPetManagerController {

    @Autowired
    private PetService petService;


    @GetMapping("/pet-manager")
    public ResponseEntity<?> getPetManager() {
        try {
            return ResponseEntity.ok(petService.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi lấy danh sách thú cưng: " + e.getMessage());
        }
    }

    @PutMapping("/petUpdate/{id}")
    public ResponseEntity<?> updatePet(@PathVariable Integer id, @RequestBody PetDto petDto) {
        try {
            PetDto updatedPet = petService.updatePet(id, petDto);
            return ResponseEntity.ok(updatedPet);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi cập nhật thú cưng: " + e.getMessage());
        }
    }


    @PostMapping(value = "/addPetWithImage", consumes = { "multipart/form-data" })
    public ResponseEntity<?> addPetWithImage(
            @RequestPart("petDto") PetDto petDto,
            @RequestPart("imageFile") MultipartFile imageFile) {
        try {
            PetDto newPet = petService.addPetWithImage(petDto, imageFile);
            return ResponseEntity.ok(newPet);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi thêm thú cưng mới với ảnh: " + e.getMessage());
        }
    }

    @GetMapping("/images/{petId}")
    public ResponseEntity<List<PetImageDto>> getAllImagesByPetId(@PathVariable Integer petId) {
        List<PetImageDto> images = petService.findAllImagesByPetId(petId);
        return ResponseEntity.ok(images);
    }
    @PostMapping("/addImagePet/{petId}/")
    public ResponseEntity<?> addPetImage(
            @PathVariable Integer petId,
            @RequestParam(value = "file") MultipartFile imageFile
            ) {
        try {
            PetImageDto savedImage = petService.addPetImage(petId, imageFile);
            return ResponseEntity.ok(savedImage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi thêm ảnh thú cưng: " + e.getMessage());
        }
    }

    @DeleteMapping("/deleteImage/{imageId}")
    public ResponseEntity<?> deletePetImage(@PathVariable Integer imageId) {
        try {
            boolean deleted = petService.deletePetImage(imageId);
            if (deleted) {
                return ResponseEntity.ok("Xóa ảnh thú cưng thành công");
            } else {
                return ResponseEntity.status(500).body("Không thể xóa ảnh thú cưng");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi xóa ảnh thú cưng: " + e.getMessage());
        }
    }

    @PutMapping("/updateMainImage")
    public ResponseEntity<?> updateMainImage(@RequestParam Integer petId, @RequestParam Integer imageId) {
        try {
            PetImageDto mainImage = petService.updateMainImage(petId, imageId);
            return ResponseEntity.ok(mainImage);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi cập nhật ảnh chính: " + e.getMessage());
        }
    }
}
