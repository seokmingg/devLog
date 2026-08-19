package com.devlog.backend.auth.oauth;

import com.devlog.backend.auth.token.AuthProperties;
import com.devlog.backend.auth.token.RefreshTokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final OAuthAccountRepository oauthAccountRepository;
    private final RefreshTokenService refreshTokenService;
    private final AuthProperties authProperties;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();
        OAuthAccount oauthAccount = oauthAccountRepository
            .findByProviderAndProviderUserId(OAuthProvider.GOOGLE, oidcUser.getSubject())
            .orElseThrow(() -> new IllegalStateException("Google 계정 연결 정보를 찾을 수 없습니다."));

        refreshTokenService.issue(oauthAccount.getMember(), response);

        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        response.sendRedirect(authProperties.getFrontendRedirectUrl());
    }
}
