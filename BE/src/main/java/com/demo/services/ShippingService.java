package com.demo.services;

import com.demo.entities.ShippingMethod;

import java.util.List;

public interface ShippingService {
    public List<ShippingMethod> findAll();
    public ShippingMethod save(ShippingMethod shippingMethod);
    public ShippingMethod findById(int id);
    public ShippingMethod update(int id, ShippingMethod shippingMethod);
}
