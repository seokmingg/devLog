package com.devlog.backend.auth.local;

import com.devlog.backend.auth.dto.LoginRequest;
import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocalLoginService {

    private final LocalCredentialRepository localCredentialRepository;
    private final PasswordEncoder passwordEncoder;

    public Member login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        LocalCredential credential = localCredentialRepository
            .findByMemberEmail(email)
            .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(request.getPassword(), credential.getPasswordHash())) {
            throw invalidCredentials();
        }

        Member member = credential.getMember();
        if (member.getStatus() != MemberStatus.ACTIVE) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "사용할 수 없는 계정입니다."
            );
        }

        return member;
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "이메일 또는 비밀번호가 올바르지 않습니다."
        );
    }
}
