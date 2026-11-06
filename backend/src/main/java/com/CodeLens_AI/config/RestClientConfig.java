package com.CodeLens_AI.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class RestClientConfig {

    // RestClientConfig: timeouts so nothing can hang forever


    @Bean
    public RestClient.Builder restClientBuilder() {
        var factory = new JdkClientHttpRequestFactory();
        factory.setReadTimeout(Duration.ofSeconds(30));
        return RestClient.builder();
    }

    @Bean(name = {"indexingExecutor", "IndexingExecutor"})
    Executor indexingExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("index-");
        executor.initialize();
        return executor;
    }
}
