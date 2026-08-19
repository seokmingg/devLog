package com.devlog.backend.auth.local;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocalCredentialRepository extends JpaRepository<LocalCredential, Long> {

    Optional<LocalCredential> findByMemberId(Long memberId);

    Optional<LocalCredential> findByMemberEmail(String email);

    boolean existsByMemberId(Long memberId);

    void deleteAllByMemberId(Long memberId);
}
