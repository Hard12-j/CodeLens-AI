package com.CodeLens_AI.dto;

import com.CodeLens_AI.Entity.IndexStatus;

import java.time.Instant;
import java.util.UUID;

public record IndexStatusResponse(
        UUID repositoryId,
        IndexStatus indexStatus,
        int filesTotal,
        int filesProcessed,
        int chunkCount,
        Instant indexAt,
        String errorMessage
) {
}
