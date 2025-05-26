package com.demo.repositories;

import com.demo.entities.Pet;
// Bỏ import Page, Pageable nếu không dùng cho phương thức này nữa
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List; // Dùng List
import java.util.Optional;

@Repository
public interface PetRepository extends JpaRepository<Pet, Integer> {

    // --- PHƯƠNG THỨC MỚI HOẶC SỬA ĐỔI ĐỂ TRẢ VỀ LIST ---
    /**
     * Tìm TẤT CẢ Pet theo species (không phân biệt hoa thường) và fetch images.
     * Không phân trang ở đây.
     * @param species Tên loài cần tìm.
     * @return Danh sách (List) tất cả Pet thuộc loài đó.
     */
    @Query("SELECT DISTINCT p FROM Pet p LEFT JOIN FETCH p.images WHERE LOWER(p.species) = LOWER(:species)")
    List<Pet> findAllBySpeciesIgnoreCaseWithImages(@Param("species") String species); // <-- Trả về List<Pet>

    // Giữ nguyên phương thức lấy danh sách loài
    @Query("SELECT DISTINCT p.species FROM Pet p WHERE p.species IS NOT NULL AND TRIM(p.species) <> '' ORDER BY p.species")
    List<String> findAllDistinctSpecies();

    Optional<Pet> findById(Integer id);

    List<Pet> findByNameContainingIgnoreCase(String name);

    // Bỏ hoặc comment out các phương thức cũ dùng Pageable nếu không dùng nữa
    // Page<Integer> findIdsBySpeciesIgnoreCase(@Param("species") String species, Pageable pageable);
    // List<Pet> findByIdInWithImages(@Param("ids") Collection<Integer> ids);
    // Page<Pet> findBySpeciesIgnoreCaseWithImages(@Param("species") String species, Pageable pageable);
}