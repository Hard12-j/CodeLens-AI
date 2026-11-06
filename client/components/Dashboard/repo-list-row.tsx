"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    Database,
    GitBranch,
    Loader2,
    Lock,
    MessageSquareCode,
    Sparkles,
    Unlock,
} from "lucide-react";

import { RepoStatus } from "@/components/Dashboard/repo-status";
import { useStartIndexing } from "@/hooks/use-repo";
import type { Repository } from "@/lib/api";

export function RepoListRow({ repo }: { repo: Repository }) {
    const startIndexing = useStartIndexing();
    const isReady = repo.indexStatus === "READY";
    const isIndexing = repo.indexStatus === "INDEXING";

    const progress =
        repo.filesTotal > 0
            ? Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100))
            : 0;

    return (
        <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-zinc-950/70 p-3.5 backdrop-blur-md transition-all duration-200 hover:border-white/[0.16] hover:bg-zinc-900/60">
            {/* Left: Identity & Language */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 font-mono text-[11px] font-bold text-zinc-300">
                    {repo.language ? repo.language.slice(0, 2).toUpperCase() : "CS"}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="truncate font-sans text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                            {repo.name}
                        </h4>
                        <span className="text-[11px] font-mono text-zinc-500">@{repo.owner}</span>
                    </div>
                    <p className="line-clamp-1 text-xs text-zinc-400">
                        {repo.description || "// No description provided"}
                    </p>
                </div>
            </div>

            {/* Middle: Telemetry chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1 rounded bg-zinc-900/80 px-2 py-0.5 text-[11px] text-zinc-400 border border-zinc-800/80">
                    <GitBranch className="size-3 text-cyan-400" />
                    {repo.defaultBranch || "main"}
                </span>

                {repo.chunkCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <Database className="size-3" />
                        {repo.chunkCount} v-nodes
                    </span>
                )}

                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                    {repo.isPrivate ? (
                        <Lock className="size-3 text-amber-400" />
                    ) : (
                        <Unlock className="size-3 text-zinc-500" />
                    )}
                    {repo.isPrivate ? "Private" : "Public"}
                </span>

                <RepoStatus status={repo.indexStatus} />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {repo.htmlUrl && (
                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-1.5 text-zinc-500 hover:text-white transition-colors"
                        title="Open on GitHub"
                    >
                        <ArrowUpRight className="size-4" />
                    </a>
                )}

                {isReady ? (
                    <Link
                        href={`/chat/${repo.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 font-mono text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all"
                    >
                        <MessageSquareCode className="size-3.5" />
                        <span>Chat</span>
                    </Link>
                ) : isIndexing ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 font-mono text-xs text-cyan-400">
                        <Loader2 className="size-3 animate-spin" />
                        <span>{progress}%</span>
                    </span>
                ) : (
                    <button
                        onClick={() => startIndexing.mutate(repo.id)}
                        disabled={startIndexing.isPending}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-xs text-zinc-200 hover:border-cyan-400 hover:text-white transition-all disabled:opacity-50"
                    >
                        {startIndexing.isPending ? (
                            <Loader2 className="size-3 animate-spin text-cyan-400" />
                        ) : (
                            <Sparkles className="size-3 text-cyan-400" />
                        )}
                        <span>Index</span>
                    </button>
                )}
            </div>
        </div>
    );
}

