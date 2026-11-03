package com.CodeLens_AI.dto;

public record CitationDto(
        String filePath,
        Integer startLine,
        Integer endLine,
        String language
) {
}
