package com.devlog.backend.comment;

import com.devlog.backend.comment.dto.CommentPageResponse;
import com.devlog.backend.comment.dto.CommentResponse;
import com.devlog.backend.comment.dto.CreateCommentRequest;
import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.post.Post;
import com.devlog.backend.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    public CommentPageResponse getComments(Long memberId, Long postId, int page, int size) {
        ensurePostExists(postId);
        Page<Comment> comments = commentRepository.findAllByPostIdOrderByIdDesc(
            postId,
            PageRequest.of(page, size)
        );

        return new CommentPageResponse(
            comments.getContent().stream()
                .map(comment -> CommentResponse.from(comment, memberId))
                .toList(),
            comments.getNumber(),
            comments.isLast()
        );
    }

    @Transactional
    public CommentResponse createComment(Long memberId, Long postId, CreateCommentRequest request) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 회원을 찾을 수 없습니다."));

        Comment comment = commentRepository.save(Comment.create(
            post,
            member,
            request.getContents().trim()
        ));
        return CommentResponse.from(comment, memberId);
    }

    private void ensurePostExists(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.");
        }
    }
}
