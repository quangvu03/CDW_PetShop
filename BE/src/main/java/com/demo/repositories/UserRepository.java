package com.demo.repositories;

import com.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByEmail(String email);
    User findByUsername(String username);
    Optional<User> findById(int id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
