package com.devlog.backend.post;

import com.devlog.backend.member.Member;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contents;

    @Column(nullable = false, length = 10)
    private String authorInitials;

    @Column(nullable = false, length = 50)
    private String authorName;

    @Column(nullable = false, length = 20)
    private String authorTone;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false, length = 20)
    private String kind;

    @Column(nullable = false)
    private long likes;

    @Column(nullable = false)
    private boolean likedByMe;

    @Column(nullable = false, length = 500)
    private String hashtags;

    @Column(nullable = false)
    private long commentCount;

    @Column(nullable = false)
    private boolean isMine;

    private Post(
        String title,
        String contents,
        String authorInitials,
        String authorName,
        String authorTone,
        LocalDateTime createdAt,
        String kind,
        long likes,
        boolean likedByMe,
        List<String> hashtags,
        long commentCount,
        boolean isMine
    ) {
        this.title = title;
        this.contents = contents;
        this.authorInitials = authorInitials;
        this.authorName = authorName;
        this.authorTone = authorTone;
        this.createdAt = createdAt;
        this.kind = kind;
        this.likes = likes;
        this.likedByMe = likedByMe;
        this.hashtags = String.join(",", hashtags);
        this.commentCount = commentCount;
        this.isMine = isMine;
    }

    public static Post create(
        String title,
        String contents,
        String authorInitials,
        String authorName,
        String authorTone,
        LocalDateTime createdAt,
        String kind,
        long likes,
        boolean likedByMe,
        List<String> hashtags,
        long commentCount,
        boolean isMine
    ) {
        return new Post(
            title,
            contents,
            authorInitials,
            authorName,
            authorTone,
            createdAt,
            kind,
            likes,
            likedByMe,
            hashtags,
            commentCount,
            isMine
        );
    }

    public static Post createByMember(Member member, String title, String contents, String kind) {
        String nickname = member.getNickname();
        String initials = nickname.substring(0, Math.min(2, nickname.length())).toUpperCase();

        Post post = new Post(
            title,
            contents,
            initials,
            nickname,
            "blue",
            LocalDateTime.now(),
            kind,
            0,
            false,
            List.of(),
            0,
            false
        );
        post.member = member;
        return post;
    }

    public void update(String title, String contents, String kind) {
        this.title = title;
        this.contents = contents;
        this.kind = kind;
    }

    public List<String> getHashtagList() {
        if (hashtags.isBlank()) {
            return List.of();
        }
        return List.of(hashtags.split(","));
    }
}
