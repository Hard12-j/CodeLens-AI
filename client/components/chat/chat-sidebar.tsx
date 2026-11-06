"use client"

import { useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
    ChevronRight,
    Database,
    FileCode2,
    FileText,
    Folder,
    FolderGit2,
    FolderOpen,
    Layers,
    Loader2,
    MessageSquareCode,
    MessageSquarePlus,
    Plus,
    Search,
    Sparkles,
    Terminal,
} from "lucide-react"

import { useChatSessions, useCreateChatSession } from "@/hooks/use-chat"
import { useRepoTree } from "@/hooks/use-repo"
import type { RepoTreeEntry, Repository } from "@/lib/api"
import { cn } from "@/lib/utils"

type SidebarRepo = Repository & {
    indexStatus?: string
    filesProcessed?: number
    chunkCount?: number
    errorMessage?: string | null
}

function getFileIcon(path: string) {
    const lower = path.toLowerCase()
    if (lower.endsWith(".ts") || lower.endsWith(".tsx")) {
        return <span className="font-mono text-[10px] font-bold text-blue-400">TS</span>
    }
    if (lower.endsWith(".js") || lower.endsWith(".jsx")) {
        return <span className="font-mono text-[10px] font-bold text-amber-400">JS</span>
    }
    if (lower.endsWith(".py") || lower.endsWith(".ipynb")) {
        return <span className="font-mono text-[10px] font-bold text-purple-400">PY</span>
    }
    if (lower.endsWith(".java")) {
        return <span className="font-mono text-[10px] font-bold text-rose-400">JV</span>
    }
    if (lower.endsWith(".json") || lower.endsWith(".yaml") || lower.endsWith(".yml")) {
        return <span className="font-mono text-[10px] font-bold text-teal-400">CFG</span>
    }
    if (lower.endsWith(".md") || lower.endsWith(".txt")) {
        return <FileText className="size-3.5 text-zinc-400" />
    }
    return <FileCode2 className="size-3.5 text-cyan-400" />
}

export function ChatSidebar({
    repo,
    sessionId,
    onSelectSession,
    onSelectFilePrompt,
    className,
}: {
    repo: SidebarRepo
    sessionId: string | null
    onSelectSession: (sessionId: string) => void
    onSelectFilePrompt?: (prompt: string) => void
    className?: string
}) {
    const [tab, setTab] = useState<"chats" | "tree">("chats")
    const [fileSearch, setFileSearch] = useState("")

    const sessionsQuery = useChatSessions(repo.id, repo.indexStatus === "READY")
    const createSession = useCreateChatSession(repo.id)
    const treeQuery = useRepoTree(repo.id, tab === "tree")

    const sessions = sessionsQuery.data ?? []

    // Filtered tree entries
    const files = useMemo(() => {
        const raw = treeQuery.data?.tree ?? []
        const query = fileSearch.trim().toLowerCase()
        if (!query) return raw.filter((item) => item.type === "blob")
        return raw.filter(
            (item) => item.type === "blob" && item.path.toLowerCase().includes(query)
        )
    }, [treeQuery.data, fileSearch])

    const handleCreateChat = () => {
        createSession.mutate(undefined, {
            onSuccess: (session) => {
                onSelectSession(session.id)
            },
        })
    }

    return (
        <aside className={cn("w-full shrink-0 border-b border-white/[0.08] bg-zinc-950/80 p-3 sm:p-3.5 backdrop-blur-xl md:w-80 md:border-r md:border-b-0 flex flex-col justify-between overflow-y-auto", className)}>
            <div className="space-y-3.5 sm:space-y-4">
                {/* Repository Telemetry Card */}
                <div className="rounded-xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 to-black p-3.5 shadow-md">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                            <FolderGit2 className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-xs font-bold text-white">
                                {repo.name}
                            </p>
                            <p className="truncate font-mono text-[11px] text-zinc-400">
                                @{repo.owner} · {repo.defaultBranch || "main"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="rounded-lg border border-white/[0.06] bg-zinc-950/60 px-2.5 py-1.5">
                            <div className="text-[9px] uppercase tracking-wider text-zinc-500">
                                Files Processed
                            </div>
                            <div className="mt-0.5 font-bold text-zinc-200">
                                {repo.filesProcessed ?? repo.filesTotal ?? 0}
                            </div>
                        </div>
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/30 px-2.5 py-1.5">
                            <div className="text-[9px] uppercase tracking-wider text-emerald-400">
                                Vector Chunks
                            </div>
                            <div className="mt-0.5 font-bold text-emerald-300">
                                {repo.chunkCount ?? 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher: Chats vs Repo Tree */}
                <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/60 p-1 font-mono text-xs">
                    <button
                        type="button"
                        onClick={() => setTab("chats")}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
                            tab === "chats"
                                ? "bg-cyan-500/20 text-cyan-300 font-semibold shadow-xs"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Chats ({sessions.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("tree")}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
                            tab === "tree"
                                ? "bg-cyan-500/20 text-cyan-300 font-semibold shadow-xs"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        Repo Tree 🌲
                    </button>
                </div>

                {/* Tab Content 1: Sessions */}
                {tab === "chats" && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                                Active Sessions
                            </span>
                            <button
                                onClick={handleCreateChat}
                                disabled={createSession.isPending}
                                className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2 py-0.5 font-mono text-[11px] text-cyan-300 hover:bg-cyan-900/50 transition-colors"
                            >
                                <Plus className="size-3" />
                                <span>New Chat</span>
                            </button>
                        </div>

                        {sessionsQuery.isLoading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-12 animate-pulse rounded-xl border border-white/[0.05] bg-zinc-900/50"
                                    />
                                ))}
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 p-4 text-center font-mono text-xs text-zinc-500">
                                // No conversation sessions yet. Ask your first query.
                            </div>
                        ) : (
                            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
                                {sessions.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => onSelectSession(item.id)}
                                        className={cn(
                                            "w-full rounded-xl border p-2.5 text-left transition-all",
                                            sessionId === item.id
                                                ? "border-cyan-500/40 bg-cyan-950/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-200"
                                                : "border-white/[0.05] bg-zinc-900/40 hover:border-white/[0.15] hover:bg-zinc-900/80 text-zinc-300"
                                        )}
                                    >
                                        <div className="flex items-start gap-2">
                                            <MessageSquareCode className="size-3.5 shrink-0 mt-0.5 text-cyan-400" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-sans text-xs font-semibold">
                                                    {item.title}
                                                </p>
                                                <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
                                                    {formatDistanceToNow(new Date(item.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Content 2: Repository Tree */}
                {tab === "tree" && (
                    <div className="space-y-3">
                        {/* File Search Input */}
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search files in repository..."
                                value={fileSearch}
                                onChange={(e) => setFileSearch(e.target.value)}
                                className="h-8 w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 pl-8 pr-3 font-mono text-[11px] text-zinc-200 placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none"
                            />
                        </div>

                        {treeQuery.isLoading ? (
                            <div className="flex flex-col items-center justify-center p-6 text-zinc-500 font-mono text-xs">
                                <Loader2 className="size-5 animate-spin text-cyan-400" />
                                <span className="mt-2">// Fetching Git tree...</span>
                            </div>
                        ) : treeQuery.isError ? (
                            <div className="rounded-xl border border-rose-500/20 bg-rose-950/20 p-3 text-xs text-rose-300 font-mono">
                                <p>Could not load repository tree.</p>
                                <button
                                    type="button"
                                    onClick={() => void treeQuery.refetch()}
                                    className="mt-2 text-[10px] text-cyan-400 underline hover:text-cyan-300"
                                >
                                    Retry loading tree
                                </button>
                            </div>
                        ) : files.length === 0 ? (
                            <div className="p-4 text-center font-mono text-xs text-zinc-500">
                                // No matching files found.
                            </div>
                        ) : (
                            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1">
                                {files.slice(0, 150).map((file) => (
                                    <button
                                        key={file.path}
                                        type="button"
                                        onClick={() => {
                                            onSelectFilePrompt?.(
                                                `Explain the implementation and architecture of \`${file.path}\` in this repository.`
                                            )
                                        }}
                                        className="group flex w-full items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left font-mono text-[11px] text-zinc-400 hover:border-cyan-500/30 hover:bg-zinc-900/80 hover:text-zinc-100 transition-all"
                                        title={`Click to ask about ${file.path}`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {getFileIcon(file.path)}
                                            <span className="truncate">{file.path}</span>
                                        </div>
                                        <ChevronRight className="size-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        )}
                        <p className="text-[10px] font-mono text-zinc-500 text-center">
                            💡 Tip: Click any file to ask AI to explain it!
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Tech Stamp */}
            <div className="mt-4 border-t border-zinc-900 pt-3 text-center font-mono text-[10px] text-zinc-600">
                CodeLens AST RAG v2.0
            </div>
        </aside>
    )
}
