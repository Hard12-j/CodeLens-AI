"use client";

import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Cpu,
    Database,
    Layers,
    Lock,
    Palette,
    RefreshCw,
    Shield,
    Sparkles,
    Terminal,
    UserRound,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { useCurrentUser } from "@/hooks/use-auth";
import { useRefreshRepo } from "@/hooks/use-repo";

export function SettingsDashboard() {
    const userQuery = useCurrentUser();
    const refresh = useRefreshRepo();

    if (userQuery.isLoading) {
        return (
            <div className="space-y-6 p-4 md:p-8">
                <div className="h-48 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
                <div className="h-48 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
            </div>
        );
    }

    if (userQuery.isError || !userQuery.data) {
        return (
            <div className="m-8 max-w-md rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-md">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
                    <AlertCircle className="size-6" />
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold text-white">
                    Unable to Load Account Settings
                </h3>
                <p className="mt-2 font-mono text-xs text-zinc-400">
                    {userQuery.error instanceof Error
                        ? userQuery.error.message
                        : "Your account telemetry is currently unavailable."}
                </p>
                <button
                    onClick={() => void userQuery.refetch()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-200 hover:bg-zinc-800"
                >
                    Retry Request
                </button>
            </div>
        );
    }

    const user = userQuery.data;

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-6xl">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                        <Terminal className="size-3.5" />
                    </span>
                    <h1 className="font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                        System & Account Settings
                    </h1>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                    Manage connected GitHub credentials, AI vector telemetry, and visual theme preferences.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Connected GitHub Account Pod */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
                            <GithubIcon className="size-4 text-cyan-400" />
                            GitHub Identity
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 font-mono text-[10px] text-emerald-300">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            CONNECTED
                        </span>
                    </div>

                    <div className="mt-6 flex items-center gap-4">
                        {user.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                alt={user.displayName}
                                className="size-14 rounded-2xl border border-cyan-500/30 object-cover shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                src={user.avatarUrl}
                            />
                        ) : (
                            <div className="flex size-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-lg font-bold text-white">
                                {user.displayName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-base font-bold text-white">
                                {user.displayName}
                            </p>
                            <p className="truncate font-mono text-xs text-cyan-400">
                                @{user.githubUsername}
                            </p>
                            <p className="mt-1 font-mono text-[11px] text-zinc-500">
                                GitHub ID: {user.githubId}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-zinc-800/80 pt-4 space-y-2 font-mono text-[11px] text-zinc-400">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">Token Storage:</span>
                            <span className="flex items-center gap-1 text-emerald-400">
                                <Lock className="size-3" /> AES-256 GCM Encrypted
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-500">OAuth Scopes:</span>
                            <span className="text-zinc-300">repo (read:org, user:email)</span>
                        </div>
                    </div>
                </div>

                {/* 2. Neural Vector Engine Specifications */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
                            <Cpu className="size-4 text-emerald-400" />
                            Neural RAG Engine
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500">SPRING AI 2.0.1</span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs">
                        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Embedding Model</span>
                            <p className="mt-1 font-bold text-cyan-300">text-embedding-004</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Vector Space</span>
                            <p className="mt-1 font-bold text-emerald-300">768 Dimensions</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Vector Store</span>
                            <p className="mt-1 font-bold text-purple-300">PgVector (HNSW)</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/60 p-3">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Inference LLM</span>
                            <p className="mt-1 font-bold text-amber-300">Groq (Llama 3.3 70B)</p>
                        </div>
                    </div>

                    <div className="mt-5 border-t border-zinc-800/80 pt-4 flex items-center justify-between font-mono text-[11px]">
                        <span className="text-zinc-500">Metric Distance:</span>
                        <span className="text-zinc-300 font-bold">COSINE_DISTANCE</span>
                    </div>
                </div>

                {/* 3. Appearance & Theme */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
                            <Palette className="size-4 text-purple-400" />
                            Interface Theme
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                        Toggle between dark obsidian mode, light studio mode, or follow your OS system setting.
                    </p>

                    <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-zinc-950/60 p-4">
                        <span className="font-mono text-xs text-zinc-300">Theme Selector:</span>
                        <ModeToggle />
                    </div>
                </div>

                {/* 4. Repository Synchronization & Cache Control */}
                <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
                            <RefreshCw className="size-4 text-amber-400" />
                            Repository Sync & Cache
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                        Trigger a fresh synchronization with the GitHub REST API to detect new branches or repositories.
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            onClick={() => refresh.mutate()}
                            disabled={refresh.isPending}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-zinc-900/90 px-4 py-2 font-sans text-xs font-semibold text-zinc-200 transition-all hover:border-cyan-400 hover:text-white active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`size-3.5 text-cyan-400 ${refresh.isPending ? "animate-spin" : ""}`} />
                            <span>{refresh.isPending ? "Syncing..." : "Sync GitHub Now"}</span>
                        </button>
                        <span className="font-mono text-[11px] text-zinc-500">
                            {refresh.isSuccess ? "✓ Last synced successfully" : "Auto-synced"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
