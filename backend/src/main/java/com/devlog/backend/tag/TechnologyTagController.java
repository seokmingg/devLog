package com.devlog.backend.tag;

import com.devlog.backend.tag.dto.TechnologyTagResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TechnologyTagController {

    private final TechnologyTagRepository technologyTagRepository;

    @GetMapping
    public List<TechnologyTagResponse> getTags() {
        return technologyTagRepository.findAllByOrderByIdAsc().stream()
            .map(TechnologyTagResponse::from)
            .toList();
    }
}
