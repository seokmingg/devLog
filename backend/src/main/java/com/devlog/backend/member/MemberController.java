package com.devlog.backend.member;

import com.devlog.backend.member.dto.MyPageResponse;
import com.devlog.backend.member.dto.UpdateProfileRequest;
import com.devlog.backend.auth.token.RefreshTokenService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final RefreshTokenService refreshTokenService;

    @GetMapping("/me")
    public MyPageResponse getMyPage(@AuthenticationPrincipal Jwt jwt) {
        return memberService.getMyPage(Long.valueOf(jwt.getSubject()));
    }

    @PatchMapping("/me")
    public MyPageResponse updateMyProfile(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        return memberService.updateMyProfile(Long.valueOf(jwt.getSubject()), request);
    }

    @DeleteMapping("/me")
    @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void withdraw(
        @AuthenticationPrincipal Jwt jwt,
        HttpServletResponse response
    ) {
        Long memberId = Long.valueOf(jwt.getSubject());
        refreshTokenService.revokeAll(memberId);
        memberService.withdraw(memberId);
        refreshTokenService.clearRefreshTokenCookie(response);
    }
}
