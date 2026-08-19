package com.devlog.backend.comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findAllByPostIdOrderByIdDesc(Long postId, Pageable pageable);

    long countByPostId(Long postId);

    void deleteAllByPostId(Long postId);
}
