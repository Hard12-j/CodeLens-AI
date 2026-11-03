"use client";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
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
    const filesProcessed = status?.filesProcessed ?? repo.filesProcessed;
    const filesTotal = status?.filesTotal ?? repo.filesTotal;
    const chunkCount = status?.chunkCount ?? repo.chunkCount;
    const progress = getRepoProgress({ filesProcessed, filesTotal });
    const indexStatus = status?.indexStatus ?? repo.indexStatus;
    const errorMessage = status?.errorMessage ?? repo.errorMessage;

    if (indexStatus === "FAILED") {
        return (
            <Empty className="h-full border-0">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle className="text-destructive" />
                    </EmptyMedia>
                    <EmptyTitle>Indexing failed</EmptyTitle>
                    <EmptyDescription>
                        {errorMessage || "something went wrong while indexing the repository."}
                    </EmptyDescription>
                </EmptyHeader>
                <Button
                    disabled={indexMutation.isPending}
                    onClick={() => indexMutation.mutate(repo.id)}
                >
                    <RotateCcw data-icon="inline-start" />
                    Retry indexing
                </Button>
            </Empty>
        );
    }

    return (
        <Empty className="h-full border-0">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Loader2 className="animate-spin" />
                </EmptyMedia>
                <EmptyTitle>Indexing {repo.fullName}</EmptyTitle>
                <EmptyDescription>
                    {filesTotal > 0
                        ? `${filesProcessed} of ${filesTotal} files · ${chunkCount} chunks embedded`
                        : "Fetching repository files and embeddings..."}
                </EmptyDescription>
            </EmptyHeader>
            <div className="w-full max-w-sm space-y-2">
                <Progress value={Math.max(progress, filesTotal ? progress : 12)} />
                <p className="text-center text-xs text-muted-foreground">
                    You can leave this page open — chat unlocks when indexing finishes.
                </p>
            </div>
        </Empty>
    );
}
