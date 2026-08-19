package com.devlog.backend.member.dto;

import com.devlog.backend.member.Member;
import com.devlog.backend.tag.dto.TechnologyTagResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class MyPageResponse {

    private final Long id;
    private final String email;
    private final String nickname;
    private final String profileImageUrl;
    private final String role;
    private final String status;
    private final LocalDateTime createdAt;
    private final List<String> loginMethods;
    private final List<TechnologyTagResponse> interests;

    public static MyPageResponse from(
        Member member,
        List<String> loginMethods,
        List<TechnologyTagResponse> interests
    ) {
        return new MyPageResponse(
            member.getId(),
            member.getEmail(),
            member.getNickname(),
            member.getProfileImageUrl(),
            member.getRole().name(),
            member.getStatus().name(),
            member.getCreatedAt(),
            loginMethods,
            interests
        );
    }
}
