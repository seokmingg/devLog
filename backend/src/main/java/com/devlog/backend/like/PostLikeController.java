package com.devlog.backend.like;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void like(@AuthenticationPrincipal Jwt jwt, @PathVariable Long postId) {
        postLikeService.like(Long.valueOf(jwt.getSubject()), postId);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unlike(@AuthenticationPrincipal Jwt jwt, @PathVariable Long postId) {
        postLikeService.unlike(Long.valueOf(jwt.getSubject()), postId);
    }
}
