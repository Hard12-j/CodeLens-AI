package com.CodeLens_AI.services.github;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Builder
@Slf4j
public class GithubApiClient {
    private static final String API_BASE = "https://api.github.com/";
    private static final ParameterizedTypeReference<List<Map<String, Object>>> LIST_MAP = new ParameterizedTypeReference<>(){};
    private static final ParameterizedTypeReference<Map<String, Object>> MAP = new ParameterizedTypeReference<>(){};

    private final RestClient.Builder restClientBuilder;

    public List<Map<String, Object>> listUserRepos(String accessToken) {
        List<Map<String, Object>> all = new ArrayList<>();
        int page = 1;
        while(page <= 10){
            final int currentPage = page;
            List<Map<String, Object>> pageRepos = client(accessToken)
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/user/repos")
                            .queryParam("visibility", "all")
                            .queryParam("affiliation", "owner,collaborator,organization_member")
                            .queryParam("sort","updated")
                            .queryParam("per_page",100)
                            .queryParam("page",currentPage)
                            .build())
                    .retrieve()
                    .body(LIST_MAP);
            if(pageRepos == null || pageRepos.isEmpty()){
                break;
            }
            all.addAll(pageRepos);
            if(pageRepos.size() < 100){
                break;
            }
            page++;
        }
        return all;
    }

    public String getFileContent(String accessToken, String owner, String repo, String path){
        if(path == null || path.isBlank()){
            return null;
        }
        String cleanPath = path.startsWith("/") ? path.substring(1) : path;
        Map<String, Object> body = client(accessToken)
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/repos/{owner}/{repo}/contents/" + cleanPath)
                        .build(owner, repo))
                .retrieve()
                .body(MAP);

        if(body == null){
            return null;
        }

        Object encoding = body.get("encoding");
        Object content = body.get("content");
        if(content == null){
            return null;
        }
        if("base64".equals(String.valueOf(encoding))){
            String raw = String.valueOf(content).replaceAll("\\s","");
            return new String(Base64.getDecoder().decode(raw), StandardCharsets.UTF_8);
        }
        return String.valueOf(content);
    }

    public Map<String, Object> getRepoTree(String accessToken, String owner, String repo, String branch){
        String ref = (branch != null && !branch.isBlank()) ? branch : "HEAD";
        try {
            Map<String, Object> result = client(accessToken)
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/repos/{owner}/{repo}/git/trees/{branch}")
                            .queryParam("recursive", "1")
                            .build(owner, repo, ref))
                    .retrieve()
                    .body(MAP);
            return result != null ? result : Map.of("tree", List.of());
        } catch (Exception e) {
            log.warn("Failed to fetch tree with ref {}: {}", ref, e.getMessage());
            if (!"HEAD".equalsIgnoreCase(ref)) {
                try {
                    Map<String, Object> fallback = client(accessToken)
                            .get()
                            .uri(uriBuilder -> uriBuilder
                                    .path("/repos/{owner}/{repo}/git/trees/HEAD")
                                    .queryParam("recursive", "1")
                                    .build(owner, repo))
                            .retrieve()
                            .body(MAP);
                    return fallback != null ? fallback : Map.of("tree", List.of());
                } catch (Exception ex) {
                    log.error("Failed to fetch tree with HEAD for {}/{}: {}", owner, repo, ex.getMessage());
                }
            }
            return Map.of("tree", List.of());
        }
    }

    private RestClient client(String accessToken){
        return restClientBuilder
                .baseUrl(API_BASE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github+json")
                .defaultHeader("X-Github-Api-Version", "2022-11-28")
                .defaultHeader(HttpHeaders.USER_AGENT, "DevPilot")
                .build();
    }
}
