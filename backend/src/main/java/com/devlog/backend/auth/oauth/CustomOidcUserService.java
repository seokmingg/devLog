package com.devlog.backend.auth.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {

    private final GoogleOAuthMemberService googleOAuthMemberService;
    private final OidcUserService delegate = new OidcUserService();

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = delegate.loadUser(userRequest);

        if (!Boolean.TRUE.equals(oidcUser.getEmailVerified())) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("email_not_verified"),
                "인증된 Google 이메일이 필요합니다."
            );
        }

        String providerUserId = oidcUser.getSubject();
        String email = oidcUser.getEmail();

        if (providerUserId == null || email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_google_profile"),
                "Google 사용자 정보에 필수 값이 없습니다."
            );
        }

        googleOAuthMemberService.findOrCreate(
            providerUserId,
            email,
            oidcUser.getFullName(),
            oidcUser.getPicture()
        );

        return oidcUser;
    }
}
