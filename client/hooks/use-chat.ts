"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"

import { toast } from "@/components/ui/toast"
import { api, type ChatMessage, type ChatSession } from "@/lib/api"
import { QueryKeys } from "@/lib/query-keys"
import { streamChatMessage } from "@/lib/stream-chat"

export function useChatSession(repositoryId: string, enabled: boolean) {
    return useQuery({
        queryKey: QueryKeys.chat.sessions(repositoryId),
        queryFn: () => api.listSessions(repositoryId),
        enabled: Boolean(repositoryId) && enabled,
    })
}

export function useChatSessions(repositoryId: string, enabled: boolean) {
    return useQuery({
        queryKey: QueryKeys.chat.sessions(repositoryId),
        queryFn: () => api.listSessions(repositoryId),
        enabled: Boolean(repositoryId) && enabled,
    })
}

export function useChatMessages(sessionId: string | null) {
    return useQuery({
        queryKey: QueryKeys.chat.messages(sessionId ?? ""),
        queryFn: () => api.getMessages(sessionId!),
        enabled: Boolean(sessionId),
    })
}

export function useCreateChatSession(repositoryId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (title?: string) => api.createSession(repositoryId, title),
        onSuccess: (session) => {
            queryClient.setQueryData<ChatSession[]>(QueryKeys.chat.sessions(repositoryId), (current) => {
                if (!current) {
                    return [session]
                }
                const next = current.filter((item) => item.id !== session.id)
                return [session, ...next]
            })
            queryClient.setQueryData<ChatMessage[]>(QueryKeys.chat.messages(session.id), [])
            queryClient.invalidateQueries({ queryKey: QueryKeys.chat.sessions(repositoryId) })
        },
        onError: (error: Error) => {
            toast.add({
                title: "Could not create chat",
                description: error.message,
                type: "error",
            })
        },
    })
}

export function useStreamChat(sessionId: string | null) {
    const queryClient = useQueryClient()
    const abortRef = useRef<AbortController | null>(null)
    const [streaming, setStreaming] = useState(false)
    const [streamText, setStreamText] = useState("")

    const send = async (content: string, overrideSessionId?: string) => {
        const targetSessionId = overrideSessionId || sessionId
        if (!targetSessionId || !content.trim()) return

        const controller = new AbortController()
        abortRef.current = controller
        setStreaming(true)
        setStreamText("")

        const appendTargetMessage = (message: ChatMessage) => {
            if (!message || !message.id) return

            queryClient.setQueryData<ChatMessage[]>(QueryKeys.chat.messages(targetSessionId), (current) => {
                const list = current ?? []
                if (list.some((item) => item.id === message.id)) return list
                return [...list, message]
            })
        }

        await streamChatMessage(targetSessionId, content.trim(), {
            signal: controller.signal,
            onUserMessage: (message) => appendTargetMessage(message),
            onToken: (token) => {
                setStreamText((current) => `${current}${token}`)
            },
            onAssistantMessage: (message) => {
                appendTargetMessage(message)
                setStreamText("")
            },
            onDone: () => {
                setStreaming(false)
                setStreamText("")
            },
            onError: (error) => {
                setStreaming(false)
                setStreamText("")
                toast.add({
                    title: "Chat failed",
                    description: error.message,
                    type: "error",
                })
            },
        })
    }

    const stop = () => {
        abortRef.current?.abort()
        setStreaming(false)
        setStreamText("")
    }

    return { send, stop, streaming, streamText }
}
