package com.demo.controllers;

import com.demo.entities.ShippingMethod;
import com.demo.services.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/shipping")
public class ShippingController {
    @Autowired
    private ShippingService shippingService;
    @GetMapping
    public ResponseEntity<List<ShippingMethod>> findAll() {
        return ResponseEntity.ok(shippingService.findAll());
    }
}
