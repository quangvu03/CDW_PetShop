package com.demo.repositories;

import com.demo.entities.ShippingMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShippingRepository extends JpaRepository<ShippingMethod, Integer> {

    List<ShippingMethod> findAll();
}
