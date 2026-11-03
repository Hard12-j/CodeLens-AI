"use client";

import { AlertCircle, CheckCircle2, Clock3, FolderGit2, LoaderCircle } from "lucide-react";

import { RepoCard } from "@/components/Dashboard/repo-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useRepo } from "@/hooks/use-repo";

export function OverviewDashboard() {
    const reposQuery = useRepo();

    if (reposQuery.isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-28 rounded-2xl" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-2xl" />
            </div>
        );
    }

    if (reposQuery.isError) {
        return (
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Unable to load your overview</EmptyTitle>
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
        { label: "Repositories", value: counts.total, Icon: FolderGit2 },
        { label: "Ready to chat", value: counts.ready, Icon: CheckCircle2 },
        { label: "Currently indexing", value: counts.indexing, Icon: LoaderCircle },
        { label: "Waiting or failed", value: counts.pending, Icon: Clock3 },
    ];

    return (
        <div className="space-y-8">
            <section aria-label="Repository summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(({ label, value, Icon }) => (
                    <Card key={label}>
                        <CardHeader className="flex-row items-center justify-between gap-3">
                            <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
                            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold tabular-nums">{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Your repositories</h2>
                    <p className="text-sm text-muted-foreground">
                        The latest repositories connected to your workspace.
                    </p>
                </div>

                {repos.length === 0 ? (
                    <Empty className="border border-dashed">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <FolderGit2 />
                            </EmptyMedia>
                            <EmptyTitle>No repositories connected yet</EmptyTitle>
                            <EmptyDescription>
                                Sync your GitHub repositories from the Repositories page to get started.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {repos.slice(0, 3).map((repo) => (
                            <RepoCard key={repo.id} repo={repo} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
