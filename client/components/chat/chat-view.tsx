"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowLeft, GitBranch, Sparkles } from "lucide-react"

import { ChatComposer } from "@/components/chat/chat-composer"
import { ChatMessage } from "@/components/chat/chat-messages"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { IndexingState } from "@/components/chat/indexing-state"
import { AppShell } from "@/components/layout/app-shell"
import {
    useChatMessages,
    useChatSessions,
    useCreateChatSession,
    useStreamChat,
} from "@/hooks/use-chat"
import { useIndexStatus, useRepository } from "@/hooks/use-repo"

export function ChatView({ repoId }: { repoId: string }) {
    const repoQuery = useRepository(repoId)
    const isIndexing = repoQuery.data?.indexStatus === "INDEXING"
    const statusQuery = useIndexStatus(
        repoId,
        isIndexing || repoQuery.data?.indexStatus === "PENDING"
    )

    const indexStatus = statusQuery.data?.indexStatus ?? repoQuery.data?.indexStatus
    const ready = indexStatus === "READY"

    const sessionsQuery = useChatSessions(repoId, ready)
    const createSession = useCreateChatSession(repoId)
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
    const [externalPrompt, setExternalPrompt] = useState("")
    const autoCreateRef = useRef(false)

    const sessionId = selectedSessionId ?? sessionsQuery.data?.[0]?.id ?? null

    const messageQuery = useChatMessages(sessionId)
    const { send, stop, streaming, streamText } = useStreamChat(sessionId)

    useEffect(() => {
        if (!ready || sessionsQuery.isLoading) return
        if (sessionsQuery.data && sessionsQuery.data.length > 0) return
        if (!sessionsQuery.isSuccess || autoCreateRef.current) {
            return
        }

        autoCreateRef.current = true
        createSession.mutate(undefined, {
            onSuccess: (session) => {
                setSelectedSessionId(session.id)
                autoCreateRef.current = false
            },
            onError: () => {
                autoCreateRef.current = false
            },
        })
    }, [ready, sessionsQuery.isLoading, sessionsQuery.isSuccess, sessionsQuery.data, createSession])

    const handleSendMessage = async (content: string) => {
        setExternalPrompt("")
        let activeSessionId = sessionId

        if (!activeSessionId) {
            try {
                const newSession = await createSession.mutateAsync(undefined)
                setSelectedSessionId(newSession.id)
                activeSessionId = newSession.id
            } catch (err) {
                console.error("Failed to create chat session on demand", err)
                return
            }
        }

        await send(content, activeSessionId)
    }

    if (repoQuery.isLoading) {
        return (
            <AppShell title="Loading repository...">
                <div className="grid flex-1 gap-4 p-4 md:grid-cols-[20rem_1fr] bg-black">
                    <div className="h-96 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
                    <div className="h-96 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
                </div>
            </AppShell>
        )
    }

    if (repoQuery.isError || !repoQuery.data) {
        return (
            <AppShell title="Repository Unavailable">
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 bg-black">
                    <p className="font-mono text-xs text-rose-400">
                        {(repoQuery.error as Error)?.message ?? "Repository could not be found."}
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-200 hover:bg-zinc-800"
                    >
                        <ArrowLeft className="size-3.5" />
                        <span>Return to Observatory</span>
                    </Link>
                </div>
            </AppShell>
        )
    }

    const repo = repoQuery.data

    return (
        <AppShell
            title={repo.fullName}
            description={
                ready ? "Neural AST RAG grounding active" : "Vector store indexing in progress"
            }
            actions={
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-zinc-900/80 px-3 py-1.5 font-mono text-xs text-zinc-300 hover:border-cyan-400 hover:text-white transition-all"
                >
                    <ArrowLeft className="size-3.5" />
                    <span>Repositories</span>
                </Link>
            }
        >
            <div className="flex min-h-0 flex-1 flex-col md:flex-row bg-black">
                <ChatSidebar
                    repo={{
                        ...repo,
                        indexStatus: indexStatus ?? repo.indexStatus,
                        filesProcessed: statusQuery.data?.filesProcessed ?? repo.filesProcessed,
                        chunkCount: statusQuery.data?.chunkCount ?? repo.chunkCount,
                        errorMessage: statusQuery.data?.errorMessage ?? repo.errorMessage,
                    }}
                    sessionId={sessionId}
                    onSelectSession={setSelectedSessionId}
                    onSelectFilePrompt={(prompt) => setExternalPrompt(prompt)}
                />

                <section className="flex min-h-[70vh] min-w-0 flex-1 flex-col">
                    {!ready ? (
                        <IndexingState repo={repo} status={statusQuery.data} />
                    ) : (
                        <>
                            <ChatMessage
                                repo={repo}
                                messages={messageQuery.data ?? []}
                                streamText={streamText}
                                isLoading={messageQuery.isLoading || streaming}
                            />
                            <ChatComposer
                                disable={streaming || createSession.isPending}
                                streaming={streaming}
                                initialPrompt={externalPrompt}
                                onSend={handleSendMessage}
                                onStop={stop}
                            />
                        </>
                    )}
                </section>
            </div>
        </AppShell>
    )
}

export default ChatView
