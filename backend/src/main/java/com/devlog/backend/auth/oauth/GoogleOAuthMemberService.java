package com.devlog.backend.auth.oauth;

import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.member.interest.MemberInterestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleOAuthMemberService {

    private static final OAuthProvider PROVIDER = OAuthProvider.GOOGLE;

    private final MemberRepository memberRepository;
    private final OAuthAccountRepository oauthAccountRepository;
    private final MemberInterestService memberInterestService;

    @Transactional
    public Member findOrCreate(
        String providerUserId,
        String email,
        String name,
        String profileImageUrl
    ) {
        return oauthAccountRepository
            .findByProviderAndProviderUserId(PROVIDER, providerUserId)
            .map(OAuthAccount::getMember)
            .orElseGet(() -> createMember(
                providerUserId,
                normalizeEmail(email),
                name,
                profileImageUrl
            ));
    }

    private Member createMember(
        String providerUserId,
        String email,
        String name,
        String profileImageUrl
    ) {
        if (memberRepository.existsByEmail(email)) {
            log.warn("Google signup rejected reason=account_link_required");
            throw new OAuth2AuthenticationException(
                new OAuth2Error("account_link_required"),
                "이미 가입된 이메일입니다. 기존 계정으로 로그인한 뒤 Google 계정을 연결해 주세요."
            );
        }

        String nickname = name == null || name.isBlank()
            ? email.substring(0, email.indexOf('@'))
            : name.trim();

        Member member = memberRepository.save(Member.create(
            email,
            nickname,
            profileImageUrl
        ));

        oauthAccountRepository.save(OAuthAccount.create(
            member,
            PROVIDER,
            providerUserId,
            email
        ));
        memberInterestService.assignDefaults(member);

        log.info("Google member created memberId={}", member.getId());

        return member;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
