package com.devlog.backend.tag;

import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.member.MemberStatus;
import com.devlog.backend.member.interest.MemberInterestService;
import lombok.RequiredArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TechnologyTagDataInitializer implements CommandLineRunner {

    private static final List<DefaultTag> DEFAULT_TAGS = List.of(
        new DefaultTag("Java", "java", true),
        new DefaultTag("Spring", "spring", true),
        new DefaultTag("React", "react", true),
        new DefaultTag("Docker", "docker", true),
        new DefaultTag("AWS", "aws", true),
        new DefaultTag("HTML", "html", false),
        new DefaultTag("CSS", "css", false),
        new DefaultTag("JavaScript", "javascript", false),
        new DefaultTag("TypeScript", "typescript", false),
        new DefaultTag("Python", "python", false)
    );

    private final TechnologyTagRepository technologyTagRepository;
    private final MemberRepository memberRepository;
    private final MemberInterestService memberInterestService;

    @Override
    @Transactional
    public void run(String... args) {
        for (DefaultTag defaultTag : DEFAULT_TAGS) {
            if (technologyTagRepository.findBySlug(defaultTag.getSlug()).isEmpty()) {
                technologyTagRepository.save(TechnologyTag.create(
                    defaultTag.getName(),
                    defaultTag.getSlug(),
                    defaultTag.isDefaultTag()
                ));
            }
        }
        technologyTagRepository.flush();

        memberRepository.findAllByStatus(MemberStatus.ACTIVE)
            .forEach(memberInterestService::assignDefaults);
    }

    @Getter
    @AllArgsConstructor
    private static class DefaultTag {

        private final String name;
        private final String slug;
        private final boolean defaultTag;
    }
}
