package com.CodeLens_AI;

import com.CodeLens_AI.services.github.GitHubRateLimiter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
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
