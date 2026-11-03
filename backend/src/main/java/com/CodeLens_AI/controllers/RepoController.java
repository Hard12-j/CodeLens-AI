package com.CodeLens_AI.controllers;

import com.CodeLens_AI.Entity.Repositories;
import com.CodeLens_AI.Security.CurrentUser;
import com.CodeLens_AI.dto.IndexStatusResponse;
import com.CodeLens_AI.dto.RepositoryResponse;
import com.CodeLens_AI.services.RepoService;
import com.CodeLens_AI.services.indexing.indexingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repos")
@RequiredArgsConstructor
public class RepoController {
    private final CurrentUser currentUser;
    private final RepoService repoService;
    private final indexingService indexingService;

    @GetMapping
    public List<RepositoryResponse> list(
            @RequestParam(name = "refresh", defaultValue = "true") boolean refresh
    ){
        UUID userId = currentUser.require().getId();
        if(refresh){
            return repoService.syncAndListRepo(userId);
        }
        return repoService.listStored(userId);
    }

    @GetMapping("/{id}")
    public RepositoryResponse get(@PathVariable UUID id){
        UUID userId = currentUser.require().getId();
        return repoService.toResponse(repoService.requiredOwned(id, userId));
    }

    @GetMapping("/{id}/status")
    public IndexStatusResponse status(@PathVariable UUID id){
        UUID userId = currentUser.require().getId();
        return repoService.status(id, userId);
    }

    @PostMapping("/{id}/index")
    public ResponseEntity<RepositoryResponse> index(@PathVariable UUID id){
        UUID userId = currentUser.require().getId();
        Repositories repo = indexingService.startIndexing(id, userId);
        indexingService.indexAsync(id, userId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(repoService.toResponse(repo));
    }
}
