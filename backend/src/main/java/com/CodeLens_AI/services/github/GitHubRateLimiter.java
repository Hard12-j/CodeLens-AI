package com.CodeLens_AI.services.github;

public class GitHubRateLimiter {
    private final long delayMs;

    public GitHubRateLimiter(long delayMs) {
        this.delayMs = Math.max(0, delayMs);
    }

    public void pause(){
        if(delayMs <= 0){
            return;
        }
        try {
            Thread.sleep(delayMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while rate limiting", e);
        }
    }
}
