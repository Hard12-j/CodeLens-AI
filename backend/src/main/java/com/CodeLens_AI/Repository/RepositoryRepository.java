package com.CodeLens_AI.Repository;

import com.CodeLens_AI.Entity.Repositories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RepositoryRepository extends JpaRepository<Repositories, UUID> {
    List<Repositories> findByUserIdOrderByFullNameAsc(UUID userId);

    Optional<Repositories> findByIdAndUserId(UUID uuid, UUID userId);

    Optional<Repositories> findByUserIdAndGithubRepoId(UUID userId, Long githubRepoId);


}
