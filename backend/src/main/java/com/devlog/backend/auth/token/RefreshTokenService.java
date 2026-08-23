package com.devlog.backend.auth.token;

import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberStatus;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    public static final String COOKIE_NAME = "DEVLOG_REFRESH_TOKEN";

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthProperties authProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void issue(Member member, HttpServletResponse response) {
        issueUntil(
            member,
            LocalDateTime.now().plus(authProperties.getRefreshTokenExpiration()),
            response
        );
    }

    public TokenResponse createAccessToken(Member member) {
        return jwtTokenProvider.createAccessToken(member);
    }

    private void issueUntil(
        Member member,
        LocalDateTime expiresAt,
        HttpServletResponse response
    ) {
        String rawToken = generateToken();

        refreshTokenRepository.save(RefreshToken.create(
            member,
            hash(rawToken),
            expiresAt
        ));

        long remainingSeconds = Math.max(
            0,
            Duration.between(LocalDateTime.now(), expiresAt).toSeconds()
        );
        addCookie(response, rawToken, remainingSeconds);
        log.info("Refresh token issued memberId={} expiresAt={}", member.getId(), expiresAt);
    }

    @Transactional
    public TokenResponse rotateAndCreateAccessToken(
        String rawToken,
        HttpServletResponse response
    ) {
        RefreshToken refreshToken = findUsableToken(rawToken);
        refreshToken.revoke(LocalDateTime.now());
        issueUntil(refreshToken.getMember(), refreshToken.getExpiresAt(), response);
        log.info("Refresh token rotated memberId={}", refreshToken.getMember().getId());
        return jwtTokenProvider.createAccessToken(refreshToken.getMember());
    }

    @Transactional
    public void revoke(String rawToken, HttpServletResponse response) {
        final boolean[] revoked = {false};
        if (rawToken != null && !rawToken.isBlank()) {
            refreshTokenRepository
                .findByTokenHashAndRevokedAtIsNull(hash(rawToken))
                .ifPresent(token -> {
                    token.revoke(LocalDateTime.now());
                    revoked[0] = true;
                    log.info("Refresh token revoked memberId={}", token.getMember().getId());
                });
        }

        clearCookie(response);
        if (!revoked[0]) {
            log.debug("Refresh token revoke requested without an active token");
        }
    }

    @Transactional
    public void revokeAll(Long memberId) {
        LocalDateTime now = LocalDateTime.now();
        var activeTokens = refreshTokenRepository.findAllByMemberIdAndRevokedAtIsNull(memberId);
        activeTokens.forEach(token -> token.revoke(now));
        log.info("All refresh tokens revoked memberId={} count={}", memberId, activeTokens.size());
    }

    public void clearRefreshTokenCookie(HttpServletResponse response) {
        clearCookie(response);
    }

    private RefreshToken findUsableToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            log.warn("Refresh token rejected reason=missing");
            throw unauthorized();
        }

        RefreshToken refreshToken = refreshTokenRepository
            .findByTokenHashAndRevokedAtIsNull(hash(rawToken))
            .orElseThrow(() -> {
                log.warn("Refresh token rejected reason=unknown_or_revoked");
                return unauthorized();
            });

        if (!refreshToken.isUsable(LocalDateTime.now())) {
            log.warn("Refresh token rejected memberId={} reason=expired", refreshToken.getMember().getId());
            throw unauthorized();
        }

        if (refreshToken.getMember().getStatus() != MemberStatus.ACTIVE) {
            refreshToken.revoke(LocalDateTime.now());
            log.warn("Refresh token rejected memberId={} reason=inactive_member", refreshToken.getMember().getId());
            throw unauthorized();
        }

        return refreshToken;
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256을 사용할 수 없습니다.", exception);
        }
    }

    private void addCookie(HttpServletResponse response, String token, long maxAge) {
        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
            .httpOnly(true)
            .secure(authProperties.isCookieSecure())
            .sameSite("Lax")
            .path("/api/auth")
            .maxAge(maxAge)
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearCookie(HttpServletResponse response) {
        addCookie(response, "", 0);
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "Refresh Token이 유효하지 않습니다."
        );
    }
}
