package com.devlog.backend.like;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByPostIdAndMemberId(Long postId, Long memberId);

    long countByPostId(Long postId);

    void deleteByPostIdAndMemberId(Long postId, Long memberId);

    void deleteAllByPostId(Long postId);

    void deleteAllByMemberId(Long memberId);
}
