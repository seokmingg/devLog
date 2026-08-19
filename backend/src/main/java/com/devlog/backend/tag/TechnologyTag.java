package com.devlog.backend.tag;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "technology_tags")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TechnologyTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String slug;

    @Column(nullable = false)
    private boolean defaultTag;

    private TechnologyTag(String name, String slug, boolean defaultTag) {
        this.name = name;
        this.slug = slug;
        this.defaultTag = defaultTag;
    }

    public static TechnologyTag create(String name, String slug, boolean defaultTag) {
        return new TechnologyTag(name, slug, defaultTag);
    }
}
