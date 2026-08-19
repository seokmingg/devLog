package com.devlog.backend.member.interest;

import com.devlog.backend.member.interest.dto.UpdateInterestsRequest;
import com.devlog.backend.tag.dto.TechnologyTagResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/members/me/interests")
@RequiredArgsConstructor
public class MemberInterestController {

    private final MemberInterestService memberInterestService;

    @PutMapping
    public List<TechnologyTagResponse> updateInterests(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody UpdateInterestsRequest request
    ) {
        return memberInterestService.replace(Long.valueOf(jwt.getSubject()), request.getTagIds());
    }
}
