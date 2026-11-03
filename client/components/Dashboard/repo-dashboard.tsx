"use client";

import { useMemo, useState } from "react";
import { FolderGit2 } from "lucide-react";

import {
    DashboardHeader,
    type RepositoryStatusFilter,
    type RepositoryVisibilityFilter,
} from "@/components/Dashboard/dashboard-header";
import { IndexErrorAlert } from "@/components/Dashboard/index-error-alert";
import { RepoCard } from "@/components/Dashboard/repo-card";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useRefreshRepo, useRepo } from "@/hooks/use-repo";

export function RepoDashboard() {
    const reposQuery = useRepo();
    const refresh = useRefreshRepo();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<RepositoryStatusFilter>("ALL");
    const [visibility, setVisibility] = useState<RepositoryVisibilityFilter>("ALL");

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
                repo.owner.toLowerCase().includes(query)
            );
        });
    }, [reposQuery.data, search, status, visibility]);

    const readyCount =
        reposQuery.data?.filter((repo) => repo.indexStatus === "READY").length ?? 0;

    return (
        <div className="flex min-h-full flex-col">
            <DashboardHeader
                isSyncing={refresh.isPending || reposQuery.isFetching}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                onSync={() => refresh.mutate()}
                onVisibilityChange={setVisibility}
                readyCount={readyCount}
                search={search}
                status={status}
                totalCount={reposQuery.data?.length}
                visibility={visibility}
            />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {refresh.isError && (
                    <IndexErrorAlert
                        isRetrying={refresh.isPending}
                        message={
                            refresh.error instanceof Error
                                ? refresh.error.message
                                : "Repositories could not be synced."
                        }
                        onRetry={() => refresh.mutate()}
                    />
                )}

                {reposQuery.isLoading && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={index} className="h-52 rounded-2xl" />
                        ))}
                    </div>
                )}

                {reposQuery.isError && (
                    <Empty className="border border-dashed">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderGit2 />
                            </EmptyMedia>
                            <EmptyTitle>Failed to load repositories</EmptyTitle>
                            <EmptyDescription>
                                {reposQuery.error instanceof Error
                                    ? reposQuery.error.message
                                    : "An unexpected error occurred while loading repositories."}
                            </EmptyDescription>
                        </EmptyHeader>
                        <Button onClick={() => void reposQuery.refetch()} variant="outline">
                            Try again
                        </Button>
                    </Empty>
                )}

                {reposQuery.isSuccess && filtered.length === 0 && (
                    <Empty className="border border-dashed">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderGit2 />
                            </EmptyMedia>
                            <EmptyTitle>
                                {reposQuery.data.length === 0
                                    ? "No repositories connected yet"
                                    : "No repositories found"}
                            </EmptyTitle>
                            <EmptyDescription>
                                {reposQuery.data.length === 0
                                    ? "Sync your GitHub repositories to see them here."
                                    : "Try changing your search or filters, or sync repositories again."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                {reposQuery.isSuccess && filtered.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
