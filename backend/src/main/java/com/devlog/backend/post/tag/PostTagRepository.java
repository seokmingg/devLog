package com.devlog.backend.post.tag;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostTagRepository extends JpaRepository<PostTag, Long> {

    List<PostTag> findAllByPostIdOrderByIdAsc(Long postId);

    boolean existsByPostIdAndTagId(Long postId, Long tagId);
}
