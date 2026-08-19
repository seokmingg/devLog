package com.devlog.backend.comment;

import com.devlog.backend.comment.dto.CommentPageResponse;
import com.devlog.backend.comment.dto.CommentResponse;
import com.devlog.backend.comment.dto.CreateCommentRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public CommentPageResponse getComments(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable Long postId,
        @RequestParam(defaultValue = "0") @Min(0) int page,
        @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return commentService.getComments(Long.valueOf(jwt.getSubject()), postId, page, size);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse createComment(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable Long postId,
        @Valid @RequestBody CreateCommentRequest request
    ) {
        return commentService.createComment(Long.valueOf(jwt.getSubject()), postId, request);
    }
}
