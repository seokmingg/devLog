package com.devlog.backend.member.interest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class UpdateInterestsRequest {

    @NotNull
    @Size(max = 5, message = "관심 기술은 최대 5개까지 선택할 수 있습니다.")
    private List<Long> tagIds;
}
