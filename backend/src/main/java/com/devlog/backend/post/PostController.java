package com.devlog.backend.post;

import com.devlog.backend.post.dto.response.PostCursorResponse;
import com.devlog.backend.post.dto.response.PostResponse;
import com.devlog.backend.post.dto.request.CreatePostRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Validated
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public PostCursorResponse getPosts(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "5") @Min(1) @Max(20) int size
    ) {
        return postService.getPosts(Long.valueOf(jwt.getSubject()), cursor, size);
    }

    @GetMapping("/{postId}")
    public PostResponse getPost(@AuthenticationPrincipal Jwt jwt, @PathVariable Long postId) {

        return postService.getPost(Long.valueOf(jwt.getSubject()), postId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody CreatePostRequest request
    ) {
        return postService.createPost(Long.valueOf(jwt.getSubject()), request);
    }
}
