"use client";

import { useMemo, useState } from "react";
import { FolderGit2, Sparkles, Terminal } from "lucide-react";

import {
    DashboardHeader,
    type DashboardViewMode,
    type RepositoryStatusFilter,
    type RepositoryVisibilityFilter,
} from "@/components/Dashboard/dashboard-header";
import { IndexErrorAlert } from "@/components/Dashboard/index-error-alert";
import { RepoCard } from "@/components/Dashboard/repo-card";
import { RepoListRow } from "@/components/Dashboard/repo-list-row";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { useRefreshRepo, useRepo } from "@/hooks/use-repo";

export function RepoDashboard() {
    const reposQuery = useRepo();
    const refresh = useRefreshRepo();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<RepositoryStatusFilter>("ALL");
    const [visibility, setVisibility] = useState<RepositoryVisibilityFilter>("ALL");
    const [viewMode, setViewMode] = useState<DashboardViewMode>("grid");

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return (reposQuery.data ?? []).filter((repo) => {
            if (status !== "ALL" && repo.indexStatus !== status) return false;
            if (visibility === "PRIVATE" && !repo.isPrivate) return false;
            if (visibility === "PUBLIC" && repo.isPrivate) return false;
            if (!query) return true;

            return (
                repo.fullName.toLowerCase().includes(query) ||
                repo.description?.toLowerCase().includes(query) === true ||
                repo.owner.toLowerCase().includes(query) ||
                (repo.language?.toLowerCase().includes(query) ?? false)
            );
        });
    }, [reposQuery.data, search, status, visibility]);

    const readyCount =
        reposQuery.data?.filter((repo) => repo.indexStatus === "READY").length ?? 0;
    const indexingCount =
        reposQuery.data?.filter((repo) => repo.indexStatus === "INDEXING").length ?? 0;

    return (
        <div className="flex min-h-full flex-col bg-black selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Command Observatory Header */}
            <DashboardHeader
                isSyncing={refresh.isPending || reposQuery.isFetching}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onSync={() => refresh.mutate()}
                onVisibilityChange={setVisibility}
                onViewModeChange={setViewMode}
                readyCount={readyCount}
                indexingCount={indexingCount}
                search={search}
                status={status}
                totalCount={reposQuery.data?.length ?? 0}
                viewMode={viewMode}
                visibility={visibility}
            />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-8">
                {/* Sync error alert */}
                {refresh.isError && (
                    <IndexErrorAlert
                        isRetrying={refresh.isPending}
                        message={
                            refresh.error instanceof Error
                                ? refresh.error.message
                                : "Repositories could not be synced from GitHub."
                        }
                        onRetry={() => refresh.mutate()}
                    />
                )}

                {/* Loading skeleton */}
                {reposQuery.isLoading && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-56 animate-pulse rounded-2xl border border-white/[0.05] bg-zinc-900/40"
                            />
                        ))}
                    </div>
                )}

                {/* Error empty state */}
                {reposQuery.isError && (
                    <div className="mx-auto my-12 max-w-md rounded-2xl border border-rose-500/20 bg-rose-950/10 p-8 text-center backdrop-blur-md">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
                            <FolderGit2 className="size-6" />
                        </div>
                        <h3 className="mt-4 font-sans text-base font-semibold text-white">
                            Unable to Load Repositories
                        </h3>
                        <p className="mt-2 font-mono text-xs text-zinc-400">
                            {reposQuery.error instanceof Error
                                ? reposQuery.error.message
                                : "An unexpected error occurred while communicating with the telemetry server."}
                        </p>
                        <button
                            onClick={() => void reposQuery.refetch()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-zinc-900 px-4 py-2 font-mono text-xs text-zinc-200 hover:bg-zinc-800"
                        >
                            Retry Request
                        </button>
                    </div>
                )}

                {/* Empty filter results */}
                {reposQuery.isSuccess && filtered.length === 0 && (
                    <div className="mx-auto my-16 max-w-md rounded-2xl border border-white/[0.06] bg-zinc-950/60 p-8 text-center backdrop-blur-md">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400">
                            <Terminal className="size-6 text-cyan-400" />
                        </div>
                        <h3 className="mt-4 font-sans text-base font-semibold text-white">
                            {reposQuery.data.length === 0
                                ? "No Repositories Synchronized"
                                : "No Matching Repositories"}
                        </h3>
                        <p className="mt-2 text-xs text-zinc-400">
                            {reposQuery.data.length === 0
                                ? "Sync your GitHub profile to index your repositories into CodeLens AI."
                                : "No repositories matched your search query or selected filter criteria."}
                        </p>
                        {reposQuery.data.length === 0 ? (
                            <button
                                onClick={() => refresh.mutate()}
                                disabled={refresh.isPending}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 font-sans text-xs font-semibold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:brightness-110"
                            >
                                <Sparkles className="size-3.5" />
                                <span>Sync Repositories Now</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setStatus("ALL");
                                    setVisibility("ALL");
                                }}
                                className="mt-5 inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 font-mono text-xs text-zinc-300 hover:text-white"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Successful list of repositories */}
                {reposQuery.isSuccess && filtered.length > 0 && (
                    <>
                        {viewMode === "grid" ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((repo) => (
                                    <RepoCard key={repo.id} repo={repo} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                {filtered.map((repo) => (
                                    <RepoListRow key={repo.id} repo={repo} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
