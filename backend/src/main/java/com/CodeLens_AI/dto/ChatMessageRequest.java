package com.CodeLens_AI.dto;

import jakarta.validation.constraints.NotBlank;

public record ChatMessageRequest(
        @NotBlank String content
) {
}
