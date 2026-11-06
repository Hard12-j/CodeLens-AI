"use client"

import { Bot, Database, FileCode2, Sparkles, Terminal, User } from "lucide-react"

import { ChatMarkdown } from "@/components/chat/chat-markdown"
import type { ChatMessage as ChatMessageType, Repository } from "@/lib/api"
import { cn } from "@/lib/utils"

export function ChatMessage({
    repo,
    messages,
    streamText,
    isLoading,
}: {
    repo: Repository
    messages: ChatMessageType[]
    streamText?: string
    isLoading?: boolean
}) {
    const visibleMessages = [...messages]

    // If currently streaming, append the live assistant stream token buffer
    if (
        streamText &&
        !visibleMessages.some(
            (m) =>
                m.role?.toLowerCase() === "assistant" &&
                m.content === streamText
        )
    ) {
        visibleMessages.push({
            id: "streaming-assistant",
            role: "ASSISTANT",
            content: streamText,
            citation: [],
            createdAt: new Date().toISOString(),
        })
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-black text-zinc-100">
            {/* Top Sub-Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-zinc-950/60 px-4 py-2.5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-xs text-zinc-300">
                        AST RAG Stream Active · {repo.fullName}
                    </span>
                </div>
                <div className="font-mono text-[10px] text-zinc-500">
                    {repo.chunkCount} VECTORS INDEXED
                </div>
            </div>

            {/* Scrollable Message Feed */}
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
                <div className="mx-auto flex max-w-3xl flex-col gap-6">
                    {visibleMessages.length === 0 ? (
                        <div className="my-12 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/60 to-black p-8 text-center backdrop-blur-xl">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                                <Sparkles className="size-6" />
                            </div>
                            <h3 className="mt-4 font-sans text-lg font-bold text-white">
                                CodeLens Observatory Initialized
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
                                This repository has been vectorized and indexed into PgVector. Ask any question about algorithms, file dependencies, security issues, or setup.
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-zinc-500">
                                <span>💡 Select a file from the</span>
                                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-cyan-300">Repo Tree 🌲</span>
                                <span>tab to query specific modules.</span>
                            </div>
                        </div>
                    ) : (
                        visibleMessages.map((message) => {
                            const isUser = message.role?.toLowerCase() === "user"

                            return (
                                <div
                                    key={message.id}
                                    className={cn(
                                        "flex w-full",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[88%] space-y-3 rounded-2xl border p-4 shadow-md backdrop-blur-xl transition-all",
                                            isUser
                                                ? "border-cyan-500/30 bg-zinc-900/90 text-zinc-100 shadow-[0_0_15px_rgba(6,182,212,0.08)]"
                                                : "border-white/[0.08] bg-zinc-950/80 text-zinc-200"
                                        )}
                                    >
                                        {/* Message Header */}
                                        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                                            {isUser ? (
                                                <div className="flex items-center gap-1.5 text-cyan-400">
                                                    <span className="flex size-5 items-center justify-center rounded-md bg-cyan-950/60 border border-cyan-500/30">
                                                        <User className="size-3" />
                                                    </span>
                                                    <span className="font-bold">You</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-400">
                                                    <span className="flex size-5 items-center justify-center rounded-md bg-emerald-950/60 border border-emerald-500/30">
                                                        <Sparkles className="size-3" />
                                                    </span>
                                                    <span className="font-bold">CodeLens AI</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Body */}
                                        <div className="prose prose-invert max-w-none text-xs leading-relaxed text-zinc-200">
                                            <ChatMarkdown
                                                content={message.content || ""}
                                                className="text-xs font-sans leading-relaxed"
                                            />
                                            {/* Live typing pulse cursor */}
                                            {message.id === "streaming-assistant" && (
                                                <span className="inline-block size-2 ml-1 rounded-full bg-cyan-400 animate-pulse" />
                                            )}
                                        </div>

                                        {/* Citations & Source Chunks */}
                                        {message.citation && message.citation.length > 0 && (
                                            <div className="mt-3 border-t border-zinc-800/80 pt-3">
                                                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500 pb-1.5">
                                                    <Database className="size-3 text-cyan-400" />
                                                    <span>Grounding Citations ({message.citation.length} chunks)</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {message.citation.map((cit, index) => (
                                                        <div
                                                            key={`${message.id}-${cit.filePath}-${index}`}
                                                            className="group/cit inline-flex items-center gap-1 rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-900/40 transition-colors"
                                                            title={cit.snippet || cit.filePath}
                                                        >
                                                            <FileCode2 className="size-3 text-cyan-400" />
                                                            <span className="max-w-[200px] truncate">{cit.filePath}</span>
                                                            <span className="text-zinc-500">#{cit.chunkIndex}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {/* Waiting / Thinking Indicator */}
                    {isLoading && !streamText && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2.5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-3 font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                                <span>Scanning vector store & synthesizing response...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
