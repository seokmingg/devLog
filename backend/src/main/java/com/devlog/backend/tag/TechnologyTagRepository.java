package com.devlog.backend.tag;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnologyTagRepository extends JpaRepository<TechnologyTag, Long> {

    List<TechnologyTag> findAllByOrderByIdAsc();

    List<TechnologyTag> findAllByDefaultTagTrueOrderByIdAsc();

    Optional<TechnologyTag> findBySlug(String slug);
}
