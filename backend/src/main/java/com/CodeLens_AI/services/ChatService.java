package com.CodeLens_AI.services;

import com.CodeLens_AI.Entity.*;
import com.CodeLens_AI.Exceptions.BadRequestException;
import com.CodeLens_AI.Exceptions.NotFoundException;
import com.CodeLens_AI.Repository.ChatMessageRepository;
import com.CodeLens_AI.Repository.ChatSessionRepository;
import com.CodeLens_AI.dto.ChatMessageResponse;
import com.CodeLens_AI.dto.ChatSessionResponse;
import com.CodeLens_AI.dto.CreateChatSessionRequest;
import com.CodeLens_AI.services.ai.ChatPromptBuilder;
import com.CodeLens_AI.services.ai.ChatStreamHandler;
import com.CodeLens_AI.services.ai.CitationMapper;
import com.CodeLens_AI.services.ai.CodeContextRetriever;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RepoService repoService;
    private final CodeContextRetriever codeContextRetriever;
    private final ChatPromptBuilder chatPromptBuilder;
    private final ChatStreamHandler chatStreamHandler;
    private final CitationMapper citationMapper;

    @Transactional
    public ChatSessionResponse createSession(UUID userId, CreateChatSessionRequest request){
        Repositories repo = repoService.requiredOwned(request.repositoryId(), userId);
        if(repo.getIndexStatus() != IndexStatus.READY){
            throw new BadRequestException("Repository is not ready");
        }

        String title = request.title() != null && !request.title().isBlank() ? request.title() : "Chat With" + repo.getFullName();

        ChatSession session = ChatSession.builder()
                .userId(userId)
                .repositoryId(repo.getId())
                .title(title)
                .build();

        session = chatSessionRepository.save(session);
        return toSessionResponse(session);
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> listSessions(UUID userId, UUID repositoryId){
        repoService.requiredOwned(repositoryId, userId);
        return chatSessionRepository
                .findByUserIdAndRepositoryIdOrderByCreatedAtDesc(userId, repositoryId)
                .stream()
                .map(this::toSessionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(UUID userId, UUID sessionId){
        ChatSession session = requireSession(userId, sessionId);
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId()).stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatSession requireSession(UUID userId, UUID sessionId){
        return chatSessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new NotFoundException(("Chat session not found")));
    }


    public SseEmitter streamReply(UUID userId, UUID sessionId, String userContent){
        ChatSession session = requireSession(userId, sessionId);
        Repositories repo = repoService.requiredOwned(session.getRepositoryId(), userId);
        if(repo.getIndexStatus() != IndexStatus.READY){
            throw new BadRequestException("Repository is not ready");
        }

        ChatMessage userMessage = chatMessageRepository.save(ChatMessage.builder()
                .sessionId(session.getId())
                .role(MessageRole.USER)
                .content(userContent)
                .build());

        var retrievedContext = codeContextRetriever.retrieve(repo.getId(), userContent);

        String systemPrompt = chatPromptBuilder.systemPrompt(repo.getFullName());
        String userPrompt = chatPromptBuilder.userPrompt(retrievedContext.contextText(), userContent);

        return chatStreamHandler.stream(
                session.getId(),
                toMessageResponse(userMessage),
                retrievedContext.citations(),
                systemPrompt,
                userPrompt
        );
    }

    private ChatSessionResponse toSessionResponse(ChatSession session){
        return new ChatSessionResponse(
                session.getId(),
                session.getRepositoryId(),
                session.getTitle(),
                session.getCreatedAt()
        );
    }

    private ChatMessageResponse toMessageResponse(ChatMessage chatMessage){
        return new ChatMessageResponse(
                chatMessage.getId(),
                chatMessage.getRole(),
                chatMessage.getContent(),
                citationMapper.fromJson(chatMessage.getCitations()),
                chatMessage.getCreatedAt()
        );
    }









}
