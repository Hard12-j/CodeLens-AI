"use client";

import { Activity, AlertCircle, CheckCircle2, Clock3, FolderGit2, Loader2, Sparkles, Terminal } from "lucide-react";

import { RepoCard } from "@/components/Dashboard/repo-card";
import { useRepo } from "@/hooks/use-repo";

export function OverviewDashboard() {
    const reposQuery = useRepo();

    if (reposQuery.isLoading) {
        return (
            <div className="space-y-6 sm:space-y-8 p-3 sm:p-6 md:p-8">
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-24 sm:h-28 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
                    ))}
                </div>
                <div className="h-64 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40" />
            </div>
        );
    }

    if (reposQuery.isError) {
        return (
            <div className="m-8 max-w-md rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-md">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
                    <AlertCircle className="size-6" />
                </div>
                <h3 className="mt-4 font-sans text-base font-semibold text-white">
                    Unable to Load Workspace Telemetry
                </h3>
                <p className="mt-2 font-mono text-xs text-zinc-400">
                    {reposQuery.error instanceof Error
                        ? reposQuery.error.message
                        : "An unexpected error occurred while loading telemetry data."}
                </p>
                <button
                    onClick={() => void reposQuery.refetch()}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-200 hover:bg-zinc-800"
                >
                    Retry Request
                </button>
            </div>
        );
    }

    const repos = reposQuery.data ?? [];
    const counts = {
        total: repos.length,
        ready: repos.filter((repo) => repo.indexStatus === "READY").length,
        indexing: repos.filter((repo) => repo.indexStatus === "INDEXING").length,
        pending: repos.filter((repo) => repo.indexStatus === "PENDING" || repo.indexStatus === "FAILED").length,
    };

    const stats = [
        {
            label: "Repositories Connected",
            value: counts.total,
            sub: "Synced from GitHub",
            Icon: FolderGit2,
            accent: "text-cyan-400",
            bgGlow: "from-cyan-500/10 to-transparent",
        },
        {
            label: "Neural-Indexed",
            value: counts.ready,
            sub: "Ready for AI Query",
            Icon: CheckCircle2,
            accent: "text-emerald-400",
            bgGlow: "from-emerald-500/10 to-transparent",
        },
        {
            label: "Scanning AST",
            value: counts.indexing,
            sub: "Currently Vectorizing",
            Icon: Activity,
            accent: "text-amber-400",
            bgGlow: "from-amber-500/10 to-transparent",
        },
        {
            label: "Standby / Unindexed",
            value: counts.pending,
            sub: "Awaiting Synthesis",
            Icon: Clock3,
            accent: "text-purple-400",
            bgGlow: "from-purple-500/10 to-transparent",
        },
    ];

    return (
        <div className="space-y-6 sm:space-y-8 p-3 sm:p-6 md:p-8">
            {/* Top Telemetry Stats */}
            <section aria-label="Repository summary" className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                {stats.map(({ label, value, sub, Icon, accent, bgGlow }) => (
                    <div
                        key={label}
                        className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/90 via-zinc-950/80 to-black/90 p-3.5 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18]"
                    >
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bgGlow} opacity-30`} />
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 truncate">{label}</span>
                            <Icon className={`size-3.5 sm:size-4 shrink-0 ${accent}`} />
                        </div>
                        <p className="mt-2 sm:mt-3 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">{value}</p>
                        <p className="mt-0.5 sm:mt-1 font-mono text-[10px] sm:text-[11px] text-zinc-500 truncate">{sub}</p>
                    </div>
                ))}
            </section>

            {/* Repositories Showcase */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-sans text-lg font-bold text-white tracking-tight">Active Neural Codebases</h2>
                        <p className="text-xs text-zinc-400">
                            Repositories indexed and ready for deep AST exploration & context retrieval.
                        </p>
                    </div>
                </div>

                {repos.length === 0 ? (
                    <div className="rounded-2xl border border-white/[0.06] bg-zinc-950/60 p-12 text-center backdrop-blur-md">
                        <Terminal className="mx-auto size-8 text-cyan-400" />
                        <h3 className="mt-4 font-sans text-base font-semibold text-white">No Repositories Synchronized</h3>
                        <p className="mt-1 text-xs text-zinc-400">
                            Navigate to the Repositories tab to connect your GitHub projects.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {repos.slice(0, 6).map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
