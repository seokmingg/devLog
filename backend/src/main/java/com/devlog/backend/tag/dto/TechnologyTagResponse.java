package com.devlog.backend.tag.dto;

import com.devlog.backend.tag.TechnologyTag;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TechnologyTagResponse {

    private final Long id;
    private final String name;
    private final String slug;

    public static TechnologyTagResponse from(TechnologyTag tag) {
        return new TechnologyTagResponse(tag.getId(), tag.getName(), tag.getSlug());
    }
}
