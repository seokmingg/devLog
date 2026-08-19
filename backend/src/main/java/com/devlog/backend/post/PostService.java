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
import lombok.RequiredArgsConstructor;
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
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;
    private final TechnologyTagRepository technologyTagRepository;
    private final PostTagRepository postTagRepository;
    private final CommentRepository commentRepository;

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

        return PostResponse.from(
            post,
            memberId,
            tags.stream().map(TechnologyTag::getName).toList(),
            0
        );
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
            commentRepository.countByPostId(post.getId())
        );
    }
}
