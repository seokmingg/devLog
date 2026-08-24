package com.devlog.backend.comment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.devlog.backend.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Getter
@AllArgsConstructor
public class CommentResponse {

    private final Long id;
    private final String authorName;
    private final String authorProfileImageUrl;
    private final String contents;
    private final OffsetDateTime createdAt;
    @JsonProperty("isMine")
    private final boolean isMine;

    public static CommentResponse from(Comment comment, Long currentMemberId) {
        return new CommentResponse(
            comment.getId(),
            comment.getMember().getNickname(),
            comment.getMember().getProfileImageUrl(),
            comment.getContents(),
            comment.getCreatedAt().atOffset(ZoneOffset.UTC),
            comment.getMember().getId().equals(currentMemberId)
        );
    }
}
