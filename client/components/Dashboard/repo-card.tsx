"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    Code2,
    Database,
    GitBranch,
    Layers,
    Loader2,
    Lock,
    MessageSquareCode,
    Sparkles,
    Terminal,
    Unlock,
} from "lucide-react";

import { IndexErrorAlert } from "@/components/Dashboard/index-error-alert";
import { RepoStatus } from "@/components/Dashboard/repo-status";
import { useStartIndexing } from "@/hooks/use-repo";
import type { Repository } from "@/lib/api";

type LanguageConfig = {
    tag: string;
    label: string;
    glowColor: string;
    badgeBg: string;
    textColor: string;
    borderColor: string;
};

function getLanguageMeta(language: string | null | undefined): LanguageConfig {
    const lang = (language || "").toLowerCase();

    if (lang.includes("typescript") || lang === "ts") {
        return {
            tag: "TS",
            label: "TypeScript",
            glowColor: "rgba(59, 130, 246, 0.35)",
            badgeBg: "bg-blue-500/15",
            textColor: "text-blue-400",
            borderColor: "border-blue-500/40",
        };
    }
    if (lang.includes("javascript") || lang === "js") {
        return {
            tag: "JS",
            label: "JavaScript",
            glowColor: "rgba(245, 158, 11, 0.35)",
            badgeBg: "bg-amber-500/15",
            textColor: "text-amber-400",
            borderColor: "border-amber-500/40",
        };
    }
    if (lang.includes("python") || lang.includes("jupyter") || lang.includes("ipynb")) {
        return {
            tag: "PY",
            label: lang.includes("jupyter") ? "Jupyter" : "Python",
            glowColor: "rgba(168, 85, 247, 0.35)",
            badgeBg: "bg-purple-500/15",
            textColor: "text-purple-400",
            borderColor: "border-purple-500/40",
        };
    }
    if (lang.includes("java")) {
        return {
            tag: "JV",
            label: "Java",
            glowColor: "rgba(239, 68, 68, 0.35)",
            badgeBg: "bg-rose-500/15",
            textColor: "text-rose-400",
            borderColor: "border-rose-500/40",
        };
    }
    if (lang.includes("rust") || lang === "rs") {
        return {
            tag: "RS",
            label: "Rust",
            glowColor: "rgba(249, 115, 22, 0.35)",
            badgeBg: "bg-orange-500/15",
            textColor: "text-orange-400",
            borderColor: "border-orange-500/40",
        };
    }
    if (lang.includes("go")) {
        return {
            tag: "GO",
            label: "Go",
            glowColor: "rgba(6, 182, 212, 0.35)",
            badgeBg: "bg-cyan-500/15",
            textColor: "text-cyan-400",
            borderColor: "border-cyan-500/40",
        };
    }

    return {
        tag: "DEV",
        label: language || "Codebase",
        glowColor: "rgba(148, 163, 184, 0.2)",
        badgeBg: "bg-zinc-800/60",
        textColor: "text-zinc-300",
        borderColor: "border-zinc-700/60",
    };
}

export function RepoCard({ repo }: { repo: Repository }) {
    const startIndexing = useStartIndexing();
    const langMeta = getLanguageMeta(repo.language);

    const progress =
        repo.filesTotal > 0
            ? Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100))
            : 0;

    const isReady = repo.indexStatus === "READY";
    const isIndexing = repo.indexStatus === "INDEXING";
    const isFailed = repo.indexStatus === "FAILED";

    return (
        <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            style={
                {
                    "--lang-glow": langMeta.glowColor,
                } as React.CSSProperties
            }
        >
            {/* Top ambient language flare */}
            <div
                className="pointer-events-none absolute -top-12 -right-12 size-36 rounded-full blur-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                style={{ backgroundColor: langMeta.glowColor }}
            />

            {/* Top laser accent line */}
            <div
                className="absolute top-0 inset-x-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `linear-gradient(90deg, transparent 0%, ${langMeta.glowColor} 50%, transparent 100%)`,
                }}
            />

            <div className="space-y-3.5 sm:space-y-4">
                {/* Header: Lens Aperture + Title + Status */}
                <div className="flex items-start justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        {/* Lens Aperture Icon */}
                        <div
                            className={`flex size-9 sm:size-11 shrink-0 items-center justify-center rounded-xl border ${langMeta.borderColor} ${langMeta.badgeBg} font-mono font-bold text-xs tracking-wider ${langMeta.textColor} shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105`}
                        >
                            {langMeta.tag}
                        </div>

                        {/* Title and Owner */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-zinc-400">
                                <Terminal className="size-3 text-zinc-500 shrink-0" />
                                <span className="truncate">@{repo.owner}</span>
                            </div>
                            <h3 className="truncate font-sans text-sm sm:text-base font-semibold text-zinc-100 tracking-tight transition-colors group-hover:text-white">
                                {repo.name}
                            </h3>
                        </div>
                    </div>

                    {/* Status Beacon */}
                    <div className="shrink-0">
                        <RepoStatus status={repo.indexStatus} />
                    </div>
                </div>

                {/* Description */}
                <p className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-zinc-400">
                    {repo.description || (
                        <span className="italic text-zinc-600">// No repository description provided.</span>
                    )}
                </p>

                {/* Telemetry HUD Ribbon */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Branch Node */}
                    <div className="inline-flex items-center gap-1 rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2 py-1 font-mono text-[11px] text-zinc-300">
                        <GitBranch className="size-3 text-cyan-400" />
                        <span className="max-w-28 truncate">{repo.defaultBranch || "main"}</span>
                    </div>

                    {/* Language Badge */}
                    {repo.language && (
                        <div
                            className={`inline-flex items-center gap-1.5 rounded-md border ${langMeta.borderColor} ${langMeta.badgeBg} px-2 py-1 font-mono text-[11px] ${langMeta.textColor}`}
                        >
                            <span className="size-1.5 rounded-full bg-current opacity-80" />
                            <span>{langMeta.label}</span>
                        </div>
                    )}

                    {/* Vector Chunks Density Pill */}
                    {repo.chunkCount > 0 && (
                        <div className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-950/30 px-2 py-1 font-mono text-[11px] text-emerald-300">
                            <Database className="size-3 text-emerald-400" />
                            <span>{repo.chunkCount} vectors</span>
                        </div>
                    )}

                    {/* Privacy Node */}
                    <div className="inline-flex items-center gap-1 rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2 py-1 font-mono text-[11px] text-zinc-400">
                        {repo.isPrivate ? (
                            <>
                                <Lock className="size-2.5 text-amber-400" />
                                <span>Private</span>
                            </>
                        ) : (
                            <>
                                <Unlock className="size-2.5 text-zinc-500" />
                                <span>Public</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Live Scanning Holographic HUD (Indexing State) */}
                {isIndexing && (
                    <div className="relative overflow-hidden rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
                        <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                            <span className="flex items-center gap-1.5">
                                <Loader2 className="size-3 animate-spin text-cyan-400" />
                                Neural AST Parsing...
                            </span>
                            <span className="font-bold text-cyan-400">{progress}%</span>
                        </div>

                        {/* High-tech segmented progress rail */}
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900 border border-cyan-500/20">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300"
                                style={{ width: `${Math.max(5, progress)}%` }}
                            />
                        </div>

                        <p className="mt-2 text-[10px] font-mono text-zinc-400">
                            // {repo.filesProcessed} of {repo.filesTotal} files processed
                        </p>
                    </div>
                )}

                {/* Error Box */}
                {isFailed && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-2.5">
                        <IndexErrorAlert message={repo.errorMessage} />
                    </div>
                )}
            </div>

            {/* Action Deck (Bottom Rail) */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between border-t border-zinc-800/60 pt-3 sm:pt-3.5">
                {/* GitHub Telemetry Link */}
                {repo.htmlUrl ? (
                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-zinc-400 transition-colors hover:text-white"
                    >
                        <span>GitHub</span>
                        <ArrowUpRight className="size-3 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                ) : (
                    <div />
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {isReady ? (
                        <Link
                            href={`/chat/${repo.id}`}
                            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-3 sm:px-3.5 py-1.5 font-sans text-xs font-semibold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95"
                        >
                            <MessageSquareCode className="size-3.5" />
                            <span>Launch Chat</span>
                            <span className="font-mono text-[10px] opacity-70">&rarr;</span>
                        </Link>
                    ) : isIndexing ? (
                        <button
                            disabled
                            className="inline-flex cursor-not-allowed items-center gap-1.5 sm:gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 sm:px-3.5 py-1.5 font-mono text-xs text-cyan-300 shadow-inner"
                        >
                            <Loader2 className="size-3 animate-spin text-cyan-400" />
                            <span>Analyzing...</span>
                        </button>
                    ) : (
                        <button
                            onClick={() => startIndexing.mutate(repo.id)}
                            disabled={startIndexing.isPending}
                            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.12] bg-zinc-900/90 px-3 sm:px-3.5 py-1.5 font-sans text-xs font-semibold text-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:border-cyan-400/50 hover:bg-zinc-800 hover:text-white hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95 disabled:opacity-50"
                        >
                            {startIndexing.isPending ? (
                                <Loader2 className="size-3.5 animate-spin text-cyan-400" />
                            ) : (
                                <Sparkles className="size-3.5 text-cyan-400" />
                            )}
                            <span>{isFailed ? "Retry" : "Index"}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
