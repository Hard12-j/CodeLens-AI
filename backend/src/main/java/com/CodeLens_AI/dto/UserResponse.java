package com.CodeLens_AI.dto;

import java.util.UUID;

public record UserResponse(
        UUID id,
        Long githubId,
        String getGithubUsername,
        String displayName,
        String avatarUrl
) {}
