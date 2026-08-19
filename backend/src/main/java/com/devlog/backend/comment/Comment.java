package com.devlog.backend.comment;

import com.devlog.backend.member.Member;
import com.devlog.backend.post.Post;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(nullable = false, length = 500)
    private String contents;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private Comment(Post post, Member member, String contents) {
        this.post = post;
        this.member = member;
        this.contents = contents;
    }

    public static Comment create(Post post, Member member, String contents) {
        return new Comment(post, member, contents);
    }

    @PrePersist
    private void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
