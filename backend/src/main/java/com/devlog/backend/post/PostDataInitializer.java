package com.devlog.backend.post;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class PostDataInitializer {

    @Bean
    CommandLineRunner initializePosts(PostRepository postRepository) {
        return args -> {
            if (postRepository.count() > 0) {
                return;
            }

            LocalDateTime now = LocalDateTime.now();

            postRepository.saveAll(List.of(
                Post.create(
                    "오늘은 DevLog 기능 구현을 마무리했다! 💪",
                    """
                    @Service
                    public class DevLogService {

                        public void create(DevLog log) {
                            if (log.getTitle() == null || log.getTitle().isBlank()) {
                                throw new IllegalArgumentException("제목은 필수입니다.");
                            }

                            logRepository.save(log);
                        }
                    }
                    """,
                    "CL", "code_lover", "blue", now.minusMinutes(60),
                    "code", 124, false,
                    List.of("Spring", "Java", "Backend", "DevLog"), 15, true
                ),
                Post.create(
                    "Spring Security 흐름 정리",
                    "Request부터 인증 처리와 DB 조회까지의 흐름을 정리했습니다.",
                    "DJ", "dev_jane", "pink", now.minusMinutes(50),
                    "diagram", 45, true,
                    List.of("SpringSecurity", "Backend"), 3, false
                ),
                Post.create(
                    "커서 기반 페이지네이션을 적용했습니다",
                    "마지막으로 조회한 게시글 ID를 기준으로 다음 게시글을 가져옵니다.",
                    "SM", "seokmin", "yellow", now.minusMinutes(40),
                    "code", 32, false,
                    List.of("Pagination", "JPA"), 2, true
                ),
                Post.create(
                    "React 무한 스크롤 구현 기록",
                    "IntersectionObserver를 사용해 다음 게시글을 자동으로 요청했습니다.",
                    "RL", "react_lee", "blue", now.minusMinutes(30),
                    "code", 27, false,
                    List.of("React", "TypeScript"), 1, false
                ),
                Post.create(
                    "Docker MySQL 개발 환경 구성",
                    "Compose를 사용해 팀원 모두 같은 MySQL 환경을 실행할 수 있게 했습니다.",
                    "DK", "dev_kang", "pink", now.minusMinutes(20),
                    "diagram", 18, false,
                    List.of("Docker", "MySQL"), 0, false
                ),
                Post.create(
                    "Swagger로 API 확인하기",
                    "Springdoc OpenAPI를 연결해 브라우저에서 API 명세를 확인했습니다.",
                    "JS", "java_sujin", "yellow", now.minusMinutes(10),
                    "code", 11, false,
                    List.of("Swagger", "OpenAPI"), 0, false
                )
            ));
        };
    }
}
