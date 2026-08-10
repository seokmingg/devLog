package com.devlog.backend.post.dto.response;

import com.devlog.backend.post.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class PostResponse {

    private final Long id;
    private final String title;
    private final String contents;
    private final AuthorResponse author;
    private final LocalDateTime createdAt;
    private final String kind;
    private final long likes;
    private final boolean likedByMe;
    private final List<String> hashtags;
    private final long commentCount;
    private final boolean isMine;

    public static PostResponse from(Post post) {
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getContents(),
            new AuthorResponse(
                post.getAuthorInitials(),
                post.getAuthorName(),
                post.getAuthorTone()
            ),
            post.getCreatedAt(),
            post.getKind(),
            post.getLikes(),
            post.isLikedByMe(),
            post.getHashtagList(),
            post.getCommentCount(),
            post.isMine()
        );
    }
}
