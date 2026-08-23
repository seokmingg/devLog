package com.devlog.backend.post;

import com.devlog.backend.post.dto.response.PostCursorResponse;
import com.devlog.backend.post.dto.response.PostResponse;
import com.devlog.backend.post.dto.request.CreatePostRequest;
import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.post.tag.PostTag;
import com.devlog.backend.post.tag.PostTagRepository;
import com.devlog.backend.tag.TechnologyTag;
import com.devlog.backend.tag.TechnologyTagRepository;
import com.devlog.backend.comment.CommentRepository;
import com.devlog.backend.like.PostLikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final TechnologyTagRepository technologyTagRepository;
    private final PostTagRepository postTagRepository;
    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;

    public PostCursorResponse getPosts(
        Long currentMemberId,
        Long cursor,
        int size,
        String tag,
        String query
    ) {
        Pageable pageable = PageRequest.of(0, size + 1);

        String tagSlug = tag == null ? null : tag.trim().toLowerCase();
        String keyword = query == null ? null : query.trim();
        boolean hasTag = tagSlug != null && !tagSlug.isBlank();
        boolean hasKeyword = keyword != null && !keyword.isBlank();
        List<Post> posts;
        if (!hasTag && !hasKeyword) {
            posts = cursor == null
                ? postRepository.findAllByOrderByIdDesc(pageable)
                : postRepository.findByIdLessThanOrderByIdDesc(cursor, pageable);
        } else if (hasTag && !hasKeyword) {
            posts = cursor == null
                ? postRepository.findAllByTagSlugOrderByIdDesc(tagSlug, pageable)
                : postRepository.findByTagSlugAndIdLessThanOrderByIdDesc(tagSlug, cursor, pageable);
        } else if (!hasTag) {
            posts = cursor == null
                ? postRepository.findAllByKeywordOrderByIdDesc(keyword, pageable)
                : postRepository.findByKeywordAndIdLessThanOrderByIdDesc(keyword, cursor, pageable);
        } else {
            posts = cursor == null
                ? postRepository.findAllByTagSlugAndKeywordOrderByIdDesc(tagSlug, keyword, pageable)
                : postRepository.findByTagSlugAndKeywordAndIdLessThanOrderByIdDesc(
                    tagSlug,
                    keyword,
                    cursor,
                    pageable
                );
        }

        boolean hasNext = posts.size() > size;
        List<Post> currentPosts = hasNext ? posts.subList(0, size) : posts;
        Long nextCursor = hasNext ? currentPosts.getLast().getId() : null;

        return new PostCursorResponse(
            currentPosts.stream().map(post -> toResponse(post, currentMemberId)).toList(),
            nextCursor,
            hasNext
        );
    }

    public PostResponse getPost(Long currentMemberId, Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "게시글을 찾을 수 없습니다."
            ));

        return toResponse(post, currentMemberId);
    }

    @Transactional
    public PostResponse createPost(Long memberId, CreatePostRequest request) {
        if (new HashSet<>(request.getTagIds()).size() != request.getTagIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "같은 기술 태그를 중복 선택할 수 없습니다.");
        }

        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 회원을 찾을 수 없습니다."));
        List<TechnologyTag> tags = request.getTagIds().stream()
            .map(tagId -> technologyTagRepository.findById(tagId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 기술 태그입니다.")))
            .toList();

        Post post = postRepository.save(Post.createByMember(
            member,
            request.getTitle().trim(),
            request.getContents().trim(),
            request.getKind()
        ));
        tags.forEach(tag -> postTagRepository.save(PostTag.create(post, tag)));

        log.info("Post created postId={} memberId={} tagCount={}", post.getId(), memberId, tags.size());

        return PostResponse.from(
            post,
            memberId,
            tags.stream().map(TechnologyTag::getName).toList(),
            0,
            0,
            false
        );
    }

    @Transactional
    public PostResponse updatePost(Long memberId, Long postId, CreatePostRequest request) {
        if (new HashSet<>(request.getTagIds()).size() != request.getTagIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "같은 기술 태그를 중복 선택할 수 없습니다.");
        }

        Post post = findOwnedPost(memberId, postId);
        List<TechnologyTag> tags = request.getTagIds().stream()
            .map(tagId -> technologyTagRepository.findById(tagId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 기술 태그입니다.")))
            .toList();

        post.update(
            request.getTitle().trim(),
            request.getContents().trim(),
            request.getKind()
        );
        postTagRepository.deleteAllByPostId(postId);
        postTagRepository.flush();
        tags.forEach(tag -> postTagRepository.save(PostTag.create(post, tag)));

        log.info("Post updated postId={} memberId={} tagCount={}", postId, memberId, tags.size());

        return PostResponse.from(
            post,
            memberId,
            tags.stream().map(TechnologyTag::getName).toList(),
            commentRepository.countByPostId(postId),
            postLikeRepository.countByPostId(postId),
            postLikeRepository.existsByPostIdAndMemberId(postId, memberId)
        );
    }

    @Transactional
    public void deletePost(Long memberId, Long postId) {
        Post post = findOwnedPost(memberId, postId);

        commentRepository.deleteAllByPostId(postId);
        postTagRepository.deleteAllByPostId(postId);
        postLikeRepository.deleteAllByPostId(postId);
        postRepository.delete(post);
        log.info("Post deleted postId={} memberId={}", postId, memberId);
    }

    private Post findOwnedPost(Long memberId, Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        if (post.getMember() == null || !post.getMember().getId().equals(memberId)) {
            log.warn("Post mutation rejected postId={} memberId={} reason=not_owner", postId, memberId);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 작성한 게시글만 변경할 수 있습니다.");
        }
        return post;
    }

    private PostResponse toResponse(Post post, Long currentMemberId) {
        List<String> tags = postTagRepository.findAllByPostIdOrderByIdAsc(post.getId()).stream()
            .map(PostTag::getTag)
            .map(TechnologyTag::getName)
            .toList();
        if (tags.isEmpty()) {
            tags = post.getHashtagList();
        }
        return PostResponse.from(
            post,
            currentMemberId,
            tags,
            commentRepository.countByPostId(post.getId()),
            postLikeRepository.countByPostId(post.getId()),
            postLikeRepository.existsByPostIdAndMemberId(post.getId(), currentMemberId)
        );
    }
}
