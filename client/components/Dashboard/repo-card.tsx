"use client";

import Link from "next/link";
import {
    Code2,
    ExternalLink,
    GitBranch,
    Loader2,
    LockKeyhole,
    MessageSquare,
    Package,
    Sparkles,
    UnlockKeyhole,
} from "lucide-react";

import { IndexErrorAlert } from "@/components/Dashboard/index-error-alert";
import { LanguageBadge } from "@/components/Dashboard/language-badge";
import { RepoStatus } from "@/components/Dashboard/repo-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { useStartIndexing } from "@/hooks/use-repo";
import type { Repository } from "@/lib/api";

function getLanguageIconBadge(language: string | null | undefined) {
    const lang = (language || "").toLowerCase();
    if (lang.includes("javascript") || lang === "js") {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 font-bold text-amber-950 text-xs shadow-xs">
                JS
            </div>
        );
    }
    if (lang.includes("typescript") || lang === "ts") {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xs shadow-xs">
                TS
            </div>
        );
    }
    if (lang.includes("python") || lang.includes("jupyter")) {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-bold text-white text-xs shadow-xs">
                PY
            </div>
        );
    }
    if (lang.includes("java")) {
        return (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-600 font-bold text-white text-xs shadow-xs">
                JV
            </div>
        );
    }
    return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted font-bold text-muted-foreground text-xs shadow-xs">
            <Code2 className="size-5" />
        </div>
    );
}

export function RepoCard({ repo }: { repo: Repository }) {
    const startIndexing = useStartIndexing();

    const progress =
        repo.filesTotal > 0
            ? Math.min(100, Math.round((repo.filesProcessed / repo.filesTotal) * 100))
            : 0;

    return (
        <Card className="flex flex-col min-w-0 transition-shadow hover:shadow-md">
            <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {getLanguageIconBadge(repo.language)}
                        <div className="min-w-0">
                            <p className="truncate text-xs text-muted-foreground">{repo.owner}</p>
                            <CardTitle className="truncate text-base font-semibold">
                                {repo.name}
                            </CardTitle>
                        </div>
                    </div>
                    <RepoStatus status={repo.indexStatus} />
                </div>

                <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                    {repo.description || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
                        <GitBranch aria-hidden="true" className="size-3.5" />
                        <span className="max-w-32 truncate">{repo.defaultBranch || "main"}</span>
                    </span>

                    <LanguageBadge language={repo.language} />

                    {repo.chunkCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
                            <Package aria-hidden="true" className="size-3.5" />
                            {repo.chunkCount} chunks
                        </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        {repo.isPrivate ? (
                            <LockKeyhole aria-hidden="true" className="size-3" />
                        ) : (
                            <UnlockKeyhole aria-hidden="true" className="size-3" />
                        )}
                        {repo.isPrivate ? "Private" : "Public"}
                    </span>
                </div>
            </CardHeader>

            {repo.indexStatus === "INDEXING" && (
                <CardContent className="space-y-1.5">
                    <Progress aria-label={`Indexing ${repo.fullName}`} value={progress}>
                        <div className="flex w-full items-center justify-between gap-3">
                            <ProgressLabel className="text-xs">Indexing files</ProgressLabel>
                            <ProgressValue className="text-xs" />
                        </div>
                    </Progress>
                    <p className="text-xs text-muted-foreground">
                        {repo.filesProcessed} of {repo.filesTotal} files processed
                    </p>
                </CardContent>
            )}

            {repo.indexStatus === "FAILED" && (
                <CardContent>
                    <IndexErrorAlert message={repo.errorMessage} />
                </CardContent>
            )}

            <CardFooter className="mt-auto flex items-center justify-between border-t p-3 md:p-4">
                {repo.htmlUrl ? (
                    <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                            className: "gap-1.5 text-xs text-muted-foreground hover:text-foreground",
                        })}
                    >
                        <ExternalLink aria-hidden="true" className="size-3.5" />
                        GitHub
                    </a>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-2">
                    {repo.indexStatus === "READY" ? (
                        <>
                            <Link
                                href={`/chat/${repo.id}`}
                                className={buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                    className: "gap-1.5 text-xs",
                                })}
                            >
                                <MessageSquare aria-hidden="true" className="size-3.5" />
                                Chat
                            </Link>
                            <Link
                                href={`/chat/${repo.id}`}
                                className={buttonVariants({
                                    variant: "default",
                                    size: "sm",
                                    className: "gap-1 text-xs",
                                })}
                            >
                                Open &rarr;
                            </Link>
                        </>
                    ) : repo.indexStatus === "INDEXING" ? (
                        <Button size="sm" disabled className="gap-1.5 text-xs">
                            <Loader2 className="size-3.5 animate-spin" />
                            Indexing...
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => startIndexing.mutate(repo.id)}
                            disabled={startIndexing.isPending}
                            className="gap-1.5 text-xs"
                        >
                            {startIndexing.isPending ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Sparkles className="size-3.5" />
                            )}
                            {repo.indexStatus === "FAILED" ? "Retry" : "Index"}
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
