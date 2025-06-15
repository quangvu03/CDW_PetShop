package com.demo.repositories;

import com.demo.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPetId(Integer petId);
    List<Comment> findByParentId(Integer parentId);
}
