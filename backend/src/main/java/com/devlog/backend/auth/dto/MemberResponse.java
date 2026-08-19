package com.devlog.backend.auth.dto;

import com.devlog.backend.member.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemberResponse {

    private final Long id;
    private final String email;
    private final String nickname;
    private final String profileImageUrl;

    public static MemberResponse from(Member member) {
        return new MemberResponse(
            member.getId(),
            member.getEmail(),
            member.getNickname(),
            member.getProfileImageUrl()
        );
    }
}
