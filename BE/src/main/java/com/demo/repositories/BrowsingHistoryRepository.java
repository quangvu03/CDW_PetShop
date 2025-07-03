package com.demo.repositories;

import com.demo.entities.BrowsingHistory;
import com.demo.entities.User;
import com.demo.entities.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BrowsingHistoryRepository extends JpaRepository<BrowsingHistory, Integer> {
    // Find browsing history by user
    java.util.List<BrowsingHistory> findByUserOrderByViewedAtDesc(User user);

    // Find browsing history by pet
    java.util.List<BrowsingHistory> findByPet(Pet pet);

    @Query("SELECT bh FROM BrowsingHistory bh WHERE bh.user = :user AND bh.pet = :pet ORDER BY bh.viewedAt DESC")
    BrowsingHistory findByUserAndPet(@Param("user") User user, @Param("pet") Pet pet);

    // Delete browsing history by user
    void deleteByUser(User user);

    // Find most viewed pets
    @Query("SELECT bh.pet, COUNT(bh) as viewCount FROM BrowsingHistory bh WHERE bh.pet IS NOT NULL GROUP BY bh.pet ORDER BY viewCount DESC")
    List<Object[]> findMostViewedPets();
}
