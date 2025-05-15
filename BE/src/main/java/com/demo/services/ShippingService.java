package com.demo.services;

import com.demo.entities.ShippingMethod;

import java.util.List;

public interface ShippingService {
    public List<ShippingMethod> findAll();
}
