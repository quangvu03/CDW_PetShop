package com.demo.services;

import com.demo.entities.BrowsingHistory;
import com.demo.entities.User;
import com.demo.entities.Pet;
import com.demo.repositories.BrowsingHistoryRepository;
import com.demo.repositories.UserRepository;
import com.demo.repositories.PetRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BrowsingHistoryServiceImpl implements BrowsingHistoryService {

    @Autowired
    private BrowsingHistoryRepository browsingHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetRepository petRepository;

    @Override
    @Transactional
    public BrowsingHistory addBrowsingHistoryForPet(int userId, int petId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thú cưng với ID: " + petId));

//        BrowsingHistory existingHistory = browsingHistoryRepository.findByUserAndPet(user, pet);
//
//        if (existingHistory != null) {
//            existingHistory.setViewedAt(Instant.now());
//            return browsingHistoryRepository.save(existingHistory);
//        } else {
            BrowsingHistory newHistory = new BrowsingHistory();
            newHistory.setUser(user);
            newHistory.setPet(pet);
            newHistory.setViewedAt(Instant.now());
            return browsingHistoryRepository.save(newHistory);
//        }
    }

    @Override
    public List<BrowsingHistory> getBrowsingHistoryByUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        return browsingHistoryRepository.findByUserOrderByViewedAtDesc(user);
    }

    @Override
    public List<BrowsingHistory> getBrowsingHistoryByPet(int petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thú cưng với ID: " + petId));

        return browsingHistoryRepository.findByPet(pet);
    }

    @Override
    @Transactional
    public void deleteBrowsingHistoryByUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + userId));

        browsingHistoryRepository.deleteByUser(user);
    }
}
