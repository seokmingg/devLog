package com.devlog.backend.like;

import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.post.Post;
import com.devlog.backend.post.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void like(Long memberId, Long postId) {
        if (postLikeRepository.existsByPostIdAndMemberId(postId, memberId)) {
            log.debug("Post like skipped postId={} memberId={} reason=already_liked", postId, memberId);
            return;
        }

        Post post = findPost(postId);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 회원을 찾을 수 없습니다."));
        postLikeRepository.save(PostLike.create(post, member));
        log.info("Post liked postId={} memberId={}", postId, memberId);
    }

    @Transactional
    public void unlike(Long memberId, Long postId) {
        findPost(postId);
        postLikeRepository.deleteByPostIdAndMemberId(postId, memberId);
        log.info("Post unliked postId={} memberId={}", postId, memberId);
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
    }
}
