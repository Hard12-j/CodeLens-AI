package com.CodeLens_AI.services.indexing;

import com.CodeLens_AI.Entity.IndexStatus;
import com.CodeLens_AI.Entity.Repositories;
import com.CodeLens_AI.Exceptions.NotFoundException;
import com.CodeLens_AI.Repository.RepositoryRepository;
import com.CodeLens_AI.services.UserService;
import com.CodeLens_AI.services.ai.RagSettings;
import com.CodeLens_AI.services.github.GitHubRateLimiter;
import com.CodeLens_AI.services.github.GithubApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class indexingService {
    private static final int VECTOR_BATCH_SIZE = 16;
    private static final int PROGRESS_EVERY_N_FILES = 1;

    private final RepositoryRepository repositoryRepository;
    private final UserService userservice;
    private final GithubApiClient gitHubApiClient;
    private final CodeFileFilter fileFilter;
    private final CodeChunker codeChunker;
    private final GitHubRateLimiter rateLimiter;
    private final VectorStore vectorStore;

    @Value("${app.indexing.max-file-bytes:102400}")
    private long maxFileByBytes;

    @Transactional
    public Repositories startIndexing(UUID repoId, UUID userId){
        Repositories repo = repositoryRepository.findByIdAndUserId(repoId, userId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));

        repo.setIndexStatus(IndexStatus.INDEXING);
        repo.setFilesProcessed(0);
        repo.setFileTotal(0);
        repo.setChunkCount(0);
        repo.setErrorMessage(null);
        repo.setUpdatedAt(Instant.now());
        return repositoryRepository.save(repo);
    }

    @Async("indexingExecutor")
    public void indexAsync(UUID repoId, UUID userId){
        try{
            log.info("Starting async indexing for repoId={} and userId={}", repoId, userId);
            doIndex(repoId, userId);
        } catch (Exception e){
            log.error("Indexing failed for repo {}", repoId, e);
            markFailed(repoId, e.getMessage());
        }
    }

    private void doIndex(UUID repoId, UUID userId){
        Repositories repo = repositoryRepository.findById(repoId)
                .orElseThrow(() -> new NotFoundException("Repository not found"));
        String token = userservice.decryptAccessToken(userservice.requiredById(userId));

        deleteExistingVector(repoId.toString());

        log.info("Fetching repo tree for {}/{} (branch: {})", repo.getOwner(), repo.getName(), repo.getDefaultBranch());
        Map<String, Object> tree = gitHubApiClient.getRepoTree(
                token, repo.getOwner(), repo.getName(), repo.getDefaultBranch());
        List<String> filePaths = listIndexableFiles(tree);

        log.info("Found {} indexable files for repo {}", filePaths.size(), repo.getFullName());
        updateProgress(repoId, filePaths.size(), 0, 0, IndexStatus.INDEXING, null);

        if(filePaths.isEmpty()){
            log.warn("No indexable files found for repo {}", repo.getFullName());
            markReady(repoId, 0, 0, 0, repo.getFullName());
            return;
        }

        List<Document> batch = new ArrayList<>();
        int processed = 0;
        int totalChunks = 0;

        for(String path : filePaths){
            try{
                String content = gitHubApiClient.getFileContent(
                        token, repo.getOwner(), repo.getName(), path);
                if(content != null && !content.isBlank()){
                    List<Document> chunks = codeChunker.chunkFile(repoId.toString(), path, content);
                    batch.addAll(chunks);
                    totalChunks += chunks.size();
                    if(batch.size() >= VECTOR_BATCH_SIZE){
                        log.info("Flushing {} vector embeddings to vector store for {}", batch.size(), repo.getFullName());
                        vectorStore.add(batch);
                        batch.clear();
                    }
                }
            }catch (Exception e){
                log.warn("Skipping file {} in {}: {}", path, repo.getFullName(), e.getMessage());
            }

            processed++;
            if(processed % PROGRESS_EVERY_N_FILES == 0 || processed == filePaths.size()){
                updateProgress(repoId, filePaths.size(), processed, totalChunks, IndexStatus.INDEXING, null);
            }
            rateLimiter.pause();
        }

        if(!batch.isEmpty()){
            log.info("Flushing final {} vector embeddings to vector store for {}", batch.size(), repo.getFullName());
            vectorStore.add(batch);
        }

        markReady(repoId, filePaths.size(), processed, totalChunks, repo.getFullName());
    }

    @SuppressWarnings("unchecked")
    private List<String> listIndexableFiles(Map<String, Object> tree){
        if(tree == null || tree.get("tree") == null){
            return List.of();
        }

        List<Map<String, Object>> entries = (List<Map<String, Object>>) tree.get("tree");
        return entries.stream()
                .filter(entry -> "blob".equals(String.valueOf(entry.get("type"))))
                .filter(entry -> {
                    String path = String.valueOf(entry.get("path"));
                    long size = entry.get("size") instanceof Number n ? n.longValue() : 0L;
                    return fileFilter.isEligible(path, size, maxFileByBytes);
                })
                .map(entry -> String.valueOf(entry.get("path")))
                .toList();
    }

    private void deleteExistingVector(String repoId){
        try{
            var filter = new FilterExpressionBuilder().eq(RagSettings.METADATA_REPO_ID, repoId).build();
            vectorStore.delete(filter);
        }catch(Exception e){
            log.warn("Could not delete existing vectors for repo {}: {}", repoId, e.getMessage());
        }
    }

    @Transactional
    public void updateProgress(
            UUID repoId,
            int total,
            int processed,
            int chunks,
            IndexStatus status,
            String error
    ){
        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setFileTotal(total);
            repo.setFilesProcessed(processed);
            repo.setChunkCount(chunks);
            repo.setIndexStatus(status);
            repo.setErrorMessage(error);
            repo.setUpdatedAt(Instant.now());
            repositoryRepository.save(repo);
        });
    }

    @Transactional
    public void markReady(UUID repoId, int totalFiles, int processedFiles, int totalChunks, String fullName){
        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setIndexStatus(IndexStatus.READY);
            repo.setFileTotal(totalFiles);
            repo.setFilesProcessed(processedFiles);
            repo.setChunkCount(totalChunks);
            repo.setIndexedAt(Instant.now());
            repo.setErrorMessage(null);
            repo.setUpdatedAt(Instant.now());
            repositoryRepository.save(repo);
        });
        log.info("Successfully indexed {} files ({} chunks) for {}", processedFiles, totalChunks, fullName);
    }

    @Transactional
    public void markFailed(UUID repoId, String errorMessage){
        repositoryRepository.findById(repoId).ifPresent(repo -> {
            repo.setIndexStatus(IndexStatus.FAILED);
            repo.setErrorMessage(errorMessage);
            repo.setUpdatedAt(Instant.now());
            repositoryRepository.save(repo);
        });
        log.error("Indexing marked as failed for repo {}: {}", repoId, errorMessage);
    }

    // indexingService: heal rows orphaned by a restart
    @EventListener(ApplicationReadyEvent.class)
    public void failStaleIndexing() {
        repositoryRepository.findAll().stream()
                .filter(r -> r.getIndexStatus() == IndexStatus.INDEXING)
                .forEach(r -> markFailed(r.getId(), "Interrupted by server restart"));
    }
}
