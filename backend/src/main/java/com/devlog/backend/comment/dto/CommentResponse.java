package com.devlog.backend.comment.dto;

import com.devlog.backend.comment.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CommentResponse {

    private final Long id;
    private final String authorName;
    private final String authorProfileImageUrl;
    private final String contents;
    private final LocalDateTime createdAt;
    private final boolean isMine;

    public static CommentResponse from(Comment comment, Long currentMemberId) {
        return new CommentResponse(
            comment.getId(),
            comment.getMember().getNickname(),
            comment.getMember().getProfileImageUrl(),
            comment.getContents(),
            comment.getCreatedAt(),
            comment.getMember().getId().equals(currentMemberId)
        );
    }
}
