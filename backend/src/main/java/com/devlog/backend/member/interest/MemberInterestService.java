package com.devlog.backend.member.interest;

import com.devlog.backend.member.Member;
import com.devlog.backend.member.MemberRepository;
import com.devlog.backend.tag.TechnologyTag;
import com.devlog.backend.tag.TechnologyTagRepository;
import com.devlog.backend.tag.dto.TechnologyTagResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberInterestService {

    public static final int MAX_INTERESTS = 5;

    private final MemberInterestRepository memberInterestRepository;
    private final MemberRepository memberRepository;
    private final TechnologyTagRepository technologyTagRepository;

    public List<TechnologyTagResponse> getInterests(Long memberId) {
        return memberInterestRepository.findAllByMemberIdOrderBySortOrderAsc(memberId).stream()
            .map(MemberInterest::getTag)
            .map(TechnologyTagResponse::from)
            .toList();
    }

    @Transactional
    public void assignDefaults(Member member) {
        if (memberInterestRepository.countByMemberId(member.getId()) > 0) {
            return;
        }

        List<TechnologyTag> defaults = technologyTagRepository
            .findAllByDefaultTagTrueOrderByIdAsc()
            .stream()
            .limit(MAX_INTERESTS)
            .toList();

        saveInterests(member, defaults);
    }

    @Transactional
    public List<TechnologyTagResponse> replace(Long memberId, List<Long> tagIds) {
        if (tagIds.size() > MAX_INTERESTS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관심 기술은 최대 5개까지 선택할 수 있습니다.");
        }
        if (new HashSet<>(tagIds).size() != tagIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "같은 관심 기술을 중복 선택할 수 없습니다.");
        }

        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 회원을 찾을 수 없습니다."));
        List<TechnologyTag> tags = tagIds.stream()
            .map(id -> technologyTagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 기술 태그입니다.")))
            .toList();

        memberInterestRepository.deleteAllByMemberId(memberId);
        memberInterestRepository.flush();
        saveInterests(member, tags);

        return getInterests(memberId);
    }

    private void saveInterests(Member member, List<TechnologyTag> tags) {
        for (int index = 0; index < tags.size(); index++) {
            memberInterestRepository.save(MemberInterest.create(member, tags.get(index), index));
        }
    }
}
