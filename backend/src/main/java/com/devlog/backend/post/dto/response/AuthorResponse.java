package com.devlog.backend.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthorResponse {

    private final String initials;
    private final String name;
    private final String tone;
}
