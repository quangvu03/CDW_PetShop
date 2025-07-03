package com.demo.services;

import com.demo.entities.BrowsingHistory;
import com.demo.entities.User;
import com.demo.entities.Pet;

import java.util.List;

public interface BrowsingHistoryService {

    BrowsingHistory addBrowsingHistoryForPet(int userId, int petId);

    List<BrowsingHistory> getBrowsingHistoryByUser(int userId);

    List<BrowsingHistory> getBrowsingHistoryByPet(int petId);

    void deleteBrowsingHistoryByUser(int userId);
}
