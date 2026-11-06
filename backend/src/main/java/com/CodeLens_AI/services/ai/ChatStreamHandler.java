package com.CodeLens_AI.services.ai;

import com.CodeLens_AI.Entity.ChatMessage;
import com.CodeLens_AI.Entity.MessageRole;
import com.CodeLens_AI.Repository.ChatMessageRepository;
import com.CodeLens_AI.dto.ChatMessageResponse;
import com.CodeLens_AI.dto.CitationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatStreamHandler {
    private final ChatModel chatModel;
    private final ChatMessageRepository chatMessageRepository;
    private final CitationMapper citationMapper;

    public SseEmitter stream(
            UUID sessionId,
            ChatMessageResponse savedUserMessage,
            List<CitationDto> citations,
            String systemPrompt,
            String userPrompt){

        SseEmitter emitter = new SseEmitter(RagSettings.STREAM_TIMEOUT_MS);
        StringBuilder fullReply = new StringBuilder();

        try{
            emitter.send(SseEmitter.event()
                    .name("user_message")
                    .data(savedUserMessage));

            ChatClient.builder(chatModel)
                    .build()
                    .prompt()
                    .system(systemPrompt)
                    .user(userPrompt)
                    .stream()
                    .content()
                    .doOnNext(token -> appendToken(emitter, fullReply, token))
                    .doOnError(err -> {
                        log.error("Chat stream error", err);
                        try {
                            emitter.send(SseEmitter.event()
                                    .name("error")
                                    .data(Map.of("message", err.getMessage() != null ? err.getMessage() : "Failed to generate AI response")));
                        } catch (Exception ignored) {
                        }
                        emitter.complete();
                    })
                    .doOnComplete(() -> completeStream(
                            emitter, sessionId, fullReply, citations))
                    .subscribe();
        } catch (Exception ex){
            try {
                emitter.send(SseEmitter.event()
                        .name("error")
                        .data(Map.of("message", ex.getMessage() != null ? ex.getMessage() : "Failed to initialize AI stream")));
            } catch (Exception ignored) {
            }
            emitter.complete();
        }

        return emitter;
    }

    private void appendToken(SseEmitter emitter, StringBuilder fullReply, String token){
        fullReply.append(token);
        try{
            emitter.send(SseEmitter.event()
                    .name("token")
                    .data(token, MediaType.APPLICATION_JSON));
        }catch (Exception ex){
            throw new IllegalStateException(ex);
        }
    }

    private void completeStream(
            SseEmitter emitter,
            UUID sessionId,
            StringBuilder fullReply,
            List<CitationDto> citations
    ){
        try{
            ChatMessage assistant = chatMessageRepository.save(ChatMessage.builder()
                    .sessionId(sessionId)
                    .role(MessageRole.ASSISTANT)
                    .content(fullReply.toString())
                    .citations(citationMapper.toJson(citations))
                    .build());

            emitter.send(SseEmitter.event()
                    .name("assistant_message")
                    .data(toMessageResponse(assistant)));
            emitter.send(SseEmitter.event().name("done").data("[DONE]"));
            emitter.complete();
        } catch (Exception e) {
            try {
                emitter.send(SseEmitter.event()
                        .name("error")
                        .data(Map.of("message", "Error completing message response")));
            } catch (Exception ignored) {
            }
            emitter.complete();
        }
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message){
        return new ChatMessageResponse(
                message.getId(),
                message.getRole(),
                message.getContent(),
                citationMapper.fromJson(message.getCitations()),
                message.getCreatedAt()
        );
    }
}
