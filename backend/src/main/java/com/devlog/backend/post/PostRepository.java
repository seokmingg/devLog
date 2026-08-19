package com.devlog.backend.post;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByIdDesc(Pageable pageable);

    List<Post> findByIdLessThanOrderByIdDesc(Long cursor, Pageable pageable);

    @Query("select pt.post from PostTag pt where pt.tag.slug = :tagSlug order by pt.post.id desc")
    List<Post> findAllByTagSlugOrderByIdDesc(@Param("tagSlug") String tagSlug, Pageable pageable);

    @Query("select pt.post from PostTag pt where pt.tag.slug = :tagSlug and pt.post.id < :cursor order by pt.post.id desc")
    List<Post> findByTagSlugAndIdLessThanOrderByIdDesc(
        @Param("tagSlug") String tagSlug,
        @Param("cursor") Long cursor,
        Pageable pageable
    );

    @Query("""
        select p from Post p
        where lower(p.title) like concat(concat('%', lower(:keyword)), '%')
           or lower(p.contents) like concat(concat('%', lower(:keyword)), '%')
        order by p.id desc
        """)
    List<Post> findAllByKeywordOrderByIdDesc(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        select p from Post p
        where p.id < :cursor
          and (lower(p.title) like concat(concat('%', lower(:keyword)), '%')
            or lower(p.contents) like concat(concat('%', lower(:keyword)), '%'))
        order by p.id desc
        """)
    List<Post> findByKeywordAndIdLessThanOrderByIdDesc(
        @Param("keyword") String keyword,
        @Param("cursor") Long cursor,
        Pageable pageable
    );

    @Query("""
        select pt.post from PostTag pt
        where pt.tag.slug = :tagSlug
          and (lower(pt.post.title) like concat(concat('%', lower(:keyword)), '%')
            or lower(pt.post.contents) like concat(concat('%', lower(:keyword)), '%'))
        order by pt.post.id desc
        """)
    List<Post> findAllByTagSlugAndKeywordOrderByIdDesc(
        @Param("tagSlug") String tagSlug,
        @Param("keyword") String keyword,
        Pageable pageable
    );

    @Query("""
        select pt.post from PostTag pt
        where pt.tag.slug = :tagSlug
          and pt.post.id < :cursor
          and (lower(pt.post.title) like concat(concat('%', lower(:keyword)), '%')
            or lower(pt.post.contents) like concat(concat('%', lower(:keyword)), '%'))
        order by pt.post.id desc
        """)
    List<Post> findByTagSlugAndKeywordAndIdLessThanOrderByIdDesc(
        @Param("tagSlug") String tagSlug,
        @Param("keyword") String keyword,
        @Param("cursor") Long cursor,
        Pageable pageable
    );
}
