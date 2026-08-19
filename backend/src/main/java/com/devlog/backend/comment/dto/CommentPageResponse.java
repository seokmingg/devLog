package com.devlog.backend.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class CommentPageResponse {

    private final List<CommentResponse> content;
    private final int number;
    private final boolean last;
}
