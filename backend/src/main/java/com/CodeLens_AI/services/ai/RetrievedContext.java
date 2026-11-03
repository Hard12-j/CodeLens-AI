package com.CodeLens_AI.services.ai;

import com.CodeLens_AI.dto.CitationDto;

import java.util.List;

public record RetrievedContext (
        List<CitationDto> citations,
        String contextText
){
}
