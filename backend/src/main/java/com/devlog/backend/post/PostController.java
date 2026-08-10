package com.devlog.backend.post;

import com.devlog.backend.post.dto.response.PostCursorResponse;
import com.devlog.backend.post.dto.response.PostResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public PostCursorResponse getPosts(
            @RequestParam(required = false) Long cursor,
            @RequestParam(defaultValue = "5") @Min(1) @Max(20) int size
    ) {
        return postService.getPosts(cursor, size);
    }

    @GetMapping("/{postId}")
    public PostResponse getPost(@PathVariable Long postId) {

        return postService.getPost(postId);
    }
}
