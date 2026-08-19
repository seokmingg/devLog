package com.devlog.backend.member.interest;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberInterestRepository extends JpaRepository<MemberInterest, Long> {

    List<MemberInterest> findAllByMemberIdOrderBySortOrderAsc(Long memberId);

    long countByMemberId(Long memberId);

    void deleteAllByMemberId(Long memberId);
}
