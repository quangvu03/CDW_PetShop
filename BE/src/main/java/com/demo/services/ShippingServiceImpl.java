package com.demo.services;

import com.demo.entities.ShippingMethod;
import com.demo.repositories.ShippingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingServiceImpl implements ShippingService {
    @Autowired
    private ShippingRepository shippingRepository;
    @Override
    public List<ShippingMethod> findAll() {
        return shippingRepository.findAll();
    }
}
