package com.devlog.backend.auth.controller;

import com.devlog.backend.auth.dto.MemberResponse;
import com.devlog.backend.auth.dto.LoginRequest;
import com.devlog.backend.auth.dto.SignupRequest;
import com.devlog.backend.auth.local.LocalLoginService;
import com.devlog.backend.auth.local.LocalSignupService;
import com.devlog.backend.auth.token.RefreshTokenService;
import com.devlog.backend.auth.token.TokenResponse;
import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final LocalSignupService localSignupService;
    private final LocalLoginService localLoginService;
    private final RefreshTokenService refreshTokenService;
    private final MemberRepository memberRepository;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse signup(@Valid @RequestBody SignupRequest request) {
        return MemberResponse.from(localSignupService.signup(request));
    }

    @PostMapping("/login")
    public TokenResponse login(
        @Valid @RequestBody LoginRequest request,
        HttpServletResponse response
    ) {
        Member member = localLoginService.login(request);
        refreshTokenService.issue(member, response);
        return refreshTokenService.createAccessToken(member);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(
        @CookieValue(name = RefreshTokenService.COOKIE_NAME, required = false) String refreshToken,
        HttpServletResponse response
    ) {
        return refreshTokenService.rotateAndCreateAccessToken(refreshToken, response);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
        @CookieValue(name = RefreshTokenService.COOKIE_NAME, required = false) String refreshToken,
        HttpServletResponse response
    ) {
        refreshTokenService.revoke(refreshToken, response);
    }

    @GetMapping("/me")
    public MemberResponse me(@AuthenticationPrincipal Jwt jwt) {
        Member member = memberRepository.findById(Long.valueOf(jwt.getSubject()))
            .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "로그인 회원을 찾을 수 없습니다."
            ));
        return MemberResponse.from(member);
    }
}
