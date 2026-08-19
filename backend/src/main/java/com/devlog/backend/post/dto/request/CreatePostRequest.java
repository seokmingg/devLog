package com.devlog.backend.post.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "제목을 입력해 주세요.")
    @Size(max = 200, message = "제목은 200자 이하로 입력해 주세요.")
    private String title;

    @NotBlank(message = "내용을 입력해 주세요.")
    @Size(max = 10000, message = "내용은 10,000자 이하로 입력해 주세요.")
    private String contents;

    @NotBlank
    @Pattern(regexp = "text|code", message = "작성 모드는 일반 글 또는 코드만 선택할 수 있습니다.")
    private String kind;

    @NotNull
    @Size(max = 5, message = "기술 태그는 최대 5개까지 선택할 수 있습니다.")
    private List<Long> tagIds;
}
