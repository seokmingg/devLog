package com.devlog.backend.auth.local;

import com.devlog.backend.auth.dto.SignupRequest;
import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class LocalSignupService {

    private final MemberRepository memberRepository;
    private final LocalCredentialRepository localCredentialRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Member signup(SignupRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (memberRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "이미 사용 중인 이메일입니다."
            );
        }

        Member member = memberRepository.save(Member.create(
            email,
            request.getNickname().trim(),
            null
        ));

        localCredentialRepository.save(LocalCredential.create(
            member,
            passwordEncoder.encode(request.getPassword())
        ));

        return member;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
