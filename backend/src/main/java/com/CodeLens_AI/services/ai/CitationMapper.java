package com.CodeLens_AI.services.ai;

import com.CodeLens_AI.dto.CitationDto;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CitationMapper {
    private final JsonMapper jsonMapper;

    public CitationDto fromDocument(Document document) {
        var meta = document.getMetadata();
        return new CitationDto(
                StringVal(meta.get("filePath")),
                intVal(meta.get("startLine")),
                intVal(meta.get("endLine")),
                StringVal(meta.get("language"))
        );
    }

    public String toJson(List<CitationDto> citations) {
        try {
            return jsonMapper.writeValueAsString(citations);
        } catch (JacksonException e) {
            return "[]";
        }
    }

    private static String StringVal(Object value) {
        return value == null ? null : value.toString();
    }

    private static int intVal(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        if (value != null) {
            try {
                return Integer.parseInt(value.toString());
            } catch (NumberFormatException ignored) {
                // Missing or malformed line metadata defaults to zero.
            }
        }
        return 0;
    }

    public List<CitationDto> fromJson(String citations) {
         if (citations == null || citations.isBlank()) {
            return List.of();
        }
        try {
            return jsonMapper.readValue(citations, new TypeReference<List<CitationDto>>() {});
        } catch (JacksonException e) {
            return List.of();
        }
    }
}
