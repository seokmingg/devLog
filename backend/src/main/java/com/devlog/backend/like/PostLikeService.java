package com.devlog.backend.like;

import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.post.Post;
import com.devlog.backend.post.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void like(Long memberId, Long postId) {
        if (postLikeRepository.existsByPostIdAndMemberId(postId, memberId)) {
            return;
        }

        Post post = findPost(postId);
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 회원을 찾을 수 없습니다."));
        postLikeRepository.save(PostLike.create(post, member));
    }

    @Transactional
    public void unlike(Long memberId, Long postId) {
        findPost(postId);
        postLikeRepository.deleteByPostIdAndMemberId(postId, memberId);
    }

    private Post findPost(Long postId) {
        return postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));
    }
}
