package com.devlog.backend.post.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.devlog.backend.post.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Getter
@AllArgsConstructor
public class PostResponse {

    private final Long id;
    private final String title;
    private final String contents;
    private final AuthorResponse author;
    private final OffsetDateTime createdAt;
    private final String kind;
    private final long likes;
    private final boolean likedByMe;
    private final List<String> hashtags;
    private final long commentCount;
    @JsonProperty("isMine")
    private final boolean isMine;

    public static PostResponse from(
        Post post,
        Long currentMemberId,
        List<String> tags,
        long commentCount,
        long likeCount,
        boolean likedByMe
    ) {
        boolean linkedMember = post.getMember() != null;
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getContents(),
            new AuthorResponse(
                linkedMember ? createInitials(post.getMember().getNickname()) : post.getAuthorInitials(),
                linkedMember ? post.getMember().getNickname() : post.getAuthorName(),
                post.getAuthorTone(),
                linkedMember ? post.getMember().getProfileImageUrl() : null
            ),
            post.getCreatedAt().atOffset(ZoneOffset.UTC),
            post.getKind(),
            likeCount,
            likedByMe,
            tags,
            commentCount,
            linkedMember
                ? post.getMember().getId().equals(currentMemberId)
                : post.isMine()
        );
    }

    private static String createInitials(String nickname) {
        return nickname.substring(0, Math.min(2, nickname.length())).toUpperCase();
    }
}
