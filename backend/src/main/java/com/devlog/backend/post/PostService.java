package com.devlog.backend.post;

import com.devlog.backend.post.dto.response.PostCursorResponse;
import com.devlog.backend.post.dto.response.PostResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    public PostCursorResponse getPosts(Long cursor, int size) {
        Pageable pageable = PageRequest.of(0, size + 1);

        List<Post> posts = cursor == null
            ? postRepository.findAllByOrderByIdDesc(pageable)
            : postRepository.findByIdLessThanOrderByIdDesc(cursor, pageable);

        boolean hasNext = posts.size() > size;
        List<Post> currentPosts = hasNext ? posts.subList(0, size) : posts;
        Long nextCursor = hasNext ? currentPosts.getLast().getId() : null;

        return new PostCursorResponse(
            currentPosts.stream().map(PostResponse::from).toList(),
            nextCursor,
            hasNext
        );
    }

    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "게시글을 찾을 수 없습니다."
            ));

        return PostResponse.from(post);
    }
}
