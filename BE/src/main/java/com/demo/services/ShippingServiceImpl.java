package com.demo.services;

import com.demo.entities.ShippingMethod;
import com.demo.repositories.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShippingServiceImpl implements ShippingService {
    @Autowired
    private ShippingRepository shippingRepository;

    @Override
    public List<ShippingMethod> findAll() {
        return shippingRepository.findAll();
    }

    @Override
    public ShippingMethod save(ShippingMethod shippingMethod) {
        return shippingRepository.save(shippingMethod);
    }

    @Override
    public ShippingMethod findById(int id) {
        return shippingRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public ShippingMethod update(int id, ShippingMethod shippingMethod) {
        ShippingMethod existingShippingMethod = shippingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức vận chuyển với ID: " + id));

        existingShippingMethod.setName(shippingMethod.getName());
        existingShippingMethod.setDescription(shippingMethod.getDescription());
        existingShippingMethod.setPrice(shippingMethod.getPrice());
        existingShippingMethod.setEstimatedTime(shippingMethod.getEstimatedTime());

        return shippingRepository.save(existingShippingMethod);
    }
}
