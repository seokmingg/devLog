package com.devlog.backend.auth.oauth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {

    List<OAuthAccount> findAllByMemberId(Long memberId);

    void deleteAllByMemberId(Long memberId);

    Optional<OAuthAccount> findByProviderAndProviderUserId(
        OAuthProvider provider,
        String providerUserId
    );

    boolean existsByProviderAndProviderUserId(
        OAuthProvider provider,
        String providerUserId
    );
}
