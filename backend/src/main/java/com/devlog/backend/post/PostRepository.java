package com.devlog.backend.post;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByIdDesc(Pageable pageable);

    List<Post> findByIdLessThanOrderByIdDesc(Long cursor, Pageable pageable);
}
