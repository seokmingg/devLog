package com.devlog.backend.auth.dto;

import com.devlog.backend.member.Member;
import com.devlog.backend.tag.dto.TechnologyTagResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MemberResponse {

    private final Long id;
    private final String email;
    private final String nickname;
    private final String profileImageUrl;
    private final List<TechnologyTagResponse> interests;

    public static MemberResponse from(Member member, List<TechnologyTagResponse> interests) {
        return new MemberResponse(
            member.getId(),
            member.getEmail(),
            member.getNickname(),
            member.getProfileImageUrl(),
            interests
        );
    }
}
