package com.devlog.backend.post.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class PostCursorResponse {

    private final List<PostResponse> content;
    private final Long nextCursor;
    private final boolean hasNext;
}
