package com.devlog.backend.member;

import com.devlog.backend.auth.local.LocalCredentialRepository;
import com.devlog.backend.auth.oauth.OAuthAccountRepository;
import com.devlog.backend.member.dto.MyPageResponse;
import com.devlog.backend.member.dto.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final LocalCredentialRepository localCredentialRepository;
    private final OAuthAccountRepository oauthAccountRepository;

    public MyPageResponse getMyPage(Long memberId) {
        Member member = findMember(memberId);

        return createMyPageResponse(member);
    }

    @Transactional
    public MyPageResponse updateMyProfile(Long memberId, UpdateProfileRequest request) {
        Member member = findMember(memberId);
        member.updateNickname(request.getNickname().trim());

        return createMyPageResponse(member);
    }

    @Transactional
    public void withdraw(Long memberId) {
        Member member = findMember(memberId);

        localCredentialRepository.deleteAllByMemberId(memberId);
        oauthAccountRepository.deleteAllByMemberId(memberId);
        member.withdraw();
    }

    private MyPageResponse createMyPageResponse(Member member) {
        Long memberId = member.getId();

        List<String> loginMethods = new ArrayList<>();
        if (localCredentialRepository.existsByMemberId(memberId)) {
            loginMethods.add("LOCAL");
        }
        oauthAccountRepository.findAllByMemberId(memberId).stream()
            .map(account -> account.getProvider().name())
            .distinct()
            .forEach(loginMethods::add);

        return MyPageResponse.from(member, List.copyOf(loginMethods));
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "로그인 회원을 찾을 수 없습니다."
            ));
    }
}
