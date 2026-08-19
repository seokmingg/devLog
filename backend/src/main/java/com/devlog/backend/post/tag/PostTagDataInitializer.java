package com.devlog.backend.post.tag;

import com.devlog.backend.post.Post;
import com.devlog.backend.post.PostRepository;
import com.devlog.backend.tag.TechnologyTag;
import com.devlog.backend.tag.TechnologyTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Component
@Order(3)
@RequiredArgsConstructor
public class PostTagDataInitializer implements CommandLineRunner {

    private final PostRepository postRepository;
    private final PostTagRepository postTagRepository;
    private final TechnologyTagRepository technologyTagRepository;

    @Override
    @Transactional
    public void run(String... args) {
        List<TechnologyTag> technologyTags = technologyTagRepository.findAll();

        for (Post post : postRepository.findAll()) {
            for (String hashtag : post.getHashtagList()) {
                findMatchingTag(technologyTags, hashtag).ifPresent(tag -> {
                    if (!postTagRepository.existsByPostIdAndTagId(post.getId(), tag.getId())) {
                        postTagRepository.save(PostTag.create(post, tag));
                    }
                });
            }
        }
    }

    private java.util.Optional<TechnologyTag> findMatchingTag(
        List<TechnologyTag> technologyTags,
        String hashtag
    ) {
        String normalized = hashtag.trim().toLowerCase(Locale.ROOT);
        return technologyTags.stream()
            .filter(tag -> tag.getSlug().equals(normalized)
                || tag.getName().toLowerCase(Locale.ROOT).equals(normalized))
            .findFirst();
    }
}
