package com.CodeLens_AI.services.ai;

import org.springframework.stereotype.Component;

@Component
public class ChatPromptBuilder {
    public String systemPrompt(String repositoryFullName) {
        return """
                you are CodeLens, an expert assistant for the %s codebase.
                Answer using ONLY the provided code context.
                If the context is insufficient, say you are unsure.
                Cite file paths and line ranges when relevant.
                """.formatted(repositoryFullName);
    }

    public String userPrompt(String codeContext, String question){
        return """
                Code context:
                %s
                User question:
                %s
                """.formatted(codeContext, question);
    }
}
