package com.CodeLens_AI;

import com.CodeLens_AI.services.github.GitHubRateLimiter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ai.model.openai.autoconfigure.OpenAiEmbeddingAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(exclude = {
        OpenAiEmbeddingAutoConfiguration.class
})
public class backendApplication {
    @Bean
    GitHubRateLimiter gitHubRateLimiter(
            @Value("${app.github.api-delay-ms:50}") long delayMs
    ) {
        return new GitHubRateLimiter(delayMs);
    }

    public static void main(String[] args) {
        SpringApplication.run(com.CodeLens_AI.backendApplication.class, args);
    }
}
