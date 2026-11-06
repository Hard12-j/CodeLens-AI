"use client";

import React from "react";
import { AlertCircle, Cpu, Database, FileCode2, Layers, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { getRepoProgress, useStartIndexing } from "@/hooks/use-repo";
import type { IndexStatusResponse, Repository } from "@/lib/api";

export function IndexingState({
    repo,
    status,
}: {
    repo: Repository;
    status?: IndexStatusResponse;
}) {
    const indexMutation = useStartIndexing();
    const filesProcessed = status?.filesProcessed ?? repo.filesProcessed ?? 0;
    const filesTotal = status?.filesTotal ?? repo.filesTotal ?? 0;
    const chunkCount = status?.chunkCount ?? repo.chunkCount ?? 0;
    const progress = getRepoProgress({ filesProcessed, filesTotal });
    const indexStatus = status?.indexStatus ?? repo.indexStatus;
    const errorMessage = status?.errorMessage ?? repo.errorMessage;

    if (indexStatus === "FAILED") {
        return (
            <div className="flex h-full w-full items-center justify-center p-3.5 sm:p-6 bg-black text-zinc-100">
                <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-zinc-950/80 to-black p-5 sm:p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] backdrop-blur-2xl text-center">
                    <div className="mx-auto flex size-12 sm:size-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/40 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                        <AlertCircle className="size-6 sm:size-7" />
                    </div>

                    <div className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-950/40 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-rose-400">
                        Indexing Terminated
                    </div>

                    <h2 className="mt-3 font-sans text-lg sm:text-xl font-bold tracking-tight text-white">
                        Vector Pipeline Failure
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                        An error occurred while parsing repository AST or computing vector embeddings for{" "}
                        <span className="font-mono text-zinc-200">{repo.fullName}</span>.
                    </p>

                    {errorMessage && (
                        <div className="mt-4 sm:mt-5 rounded-xl border border-rose-500/20 bg-black/60 p-3 sm:p-3.5 text-left font-mono text-[11px] sm:text-xs text-rose-300 overflow-x-auto">
                            <code>{errorMessage}</code>
                        </div>
                    )}

                    <div className="mt-5 sm:mt-6 flex items-center justify-center">
                        <button
                            disabled={indexMutation.isPending}
                            onClick={() => indexMutation.mutate(repo.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 sm:px-5 py-2 sm:py-2.5 font-sans text-xs font-semibold text-zinc-950 shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                        >
                            <RotateCcw className={`size-3.5 ${indexMutation.isPending ? "animate-spin" : ""}`} />
                            <span>{indexMutation.isPending ? "Re-initiating..." : "Retry Vectorization"}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const displayProgress = Math.max(progress, filesTotal > 0 ? progress : 15);

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-3.5 sm:p-6 bg-black text-zinc-100">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {/* Holographic Radar Scanner */}
                <div className="relative mx-auto flex size-16 sm:size-20 items-center justify-center">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400/20 opacity-75" />
                    <span className="absolute inline-flex size-12 sm:size-16 rounded-full border border-cyan-500/30 bg-cyan-950/30" />
                    <div className="relative flex size-10 sm:size-12 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-950/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <Cpu className="size-5 sm:size-6 animate-pulse" />
                    </div>
                </div>

                <div className="mt-5 sm:mt-6 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-300">
                        <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span>AST Parsing & PgVector Embedding</span>
                    </div>

                    <h2 className="mt-2.5 sm:mt-3 font-sans text-lg sm:text-xl font-bold tracking-tight text-white">
                        Vectorizing <span className="text-cyan-400">{repo.name}</span>
                    </h2>

                    <p className="mt-1 text-xs text-zinc-400">
                        {filesTotal > 0
                            ? `Generating 768-dimensional embeddings via Google Gemini...`
                            : `Connecting to GitHub API & building file tree map...`}
                    </p>
                </div>

                {/* Progress Bar & Telemetry */}
                <div className="mt-5 sm:mt-6 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                        <span className="text-zinc-500">Pipeline Progress</span>
                        <span className="font-bold text-cyan-400">{displayProgress}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-900">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-500"
                            style={{ width: `${displayProgress}%` }}
                        />
                    </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-1.5 sm:gap-2 border-t border-zinc-800/80 pt-3.5 sm:pt-4 font-mono text-center text-xs">
                    <div className="rounded-xl border border-white/[0.04] bg-zinc-950/60 p-2 sm:p-2.5">
                        <span className="block text-[9px] sm:text-[10px] text-zinc-500 uppercase">Processed</span>
                        <span className="mt-0.5 sm:mt-1 block font-bold text-white text-[11px] sm:text-xs">
                            {filesProcessed} <span className="text-[9px] font-normal text-zinc-500">/ {filesTotal}</span>
                        </span>
                    </div>
                    <div className="rounded-xl border border-white/[0.04] bg-zinc-950/60 p-2 sm:p-2.5">
                        <span className="block text-[9px] sm:text-[10px] text-zinc-500 uppercase">Chunks</span>
                        <span className="mt-0.5 sm:mt-1 block font-bold text-emerald-400 text-[11px] sm:text-xs">{chunkCount}</span>
                    </div>
                    <div className="rounded-xl border border-white/[0.04] bg-zinc-950/60 p-2 sm:p-2.5">
                        <span className="block text-[9px] sm:text-[10px] text-zinc-500 uppercase">Status</span>
                        <span className="mt-0.5 sm:mt-1 block font-bold text-cyan-400 text-[11px] sm:text-xs">ACTIVE</span>
                    </div>
                </div>

                <p className="mt-4 sm:mt-5 text-center font-mono text-[10px] sm:text-[11px] text-zinc-500">
                    // Chat unlocks automatically upon embedding completion.
                </p>
            </div>
        </div>
    );
}
