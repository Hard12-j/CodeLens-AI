"use client";

import { RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { IndexStatus } from "@/lib/api";

export type RepositoryStatusFilter = "ALL" | IndexStatus;
export type RepositoryVisibilityFilter = "ALL" | "PUBLIC" | "PRIVATE";

type DashboardHeaderProps = {
    search: string;
    onSearchChange: (value: string) => void;
    visibility: RepositoryVisibilityFilter;
    onVisibilityChange: (value: RepositoryVisibilityFilter) => void;
    status: RepositoryStatusFilter;
    onStatusChange: (value: RepositoryStatusFilter) => void;
    totalCount?: number;
    readyCount: number;
    onSync: () => void;
    isSyncing: boolean;
};

const statusOptions: { value: RepositoryStatusFilter; label: string }[] = [
    { value: "ALL", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "INDEXING", label: "Indexing" },
    { value: "READY", label: "Ready" },
    { value: "FAILED", label: "Failed" },
];

export function DashboardHeader({
    search,
    onSearchChange,
    visibility,
    onVisibilityChange,
    status,
    onStatusChange,
    totalCount,
    readyCount,
    onSync,
    isSyncing,
}: DashboardHeaderProps) {
    return (
        <header className="flex flex-col gap-5 border-b bg-background/80 px-4 py-5 backdrop-blur-sm md:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Search and manage the repositories connected to CodeLens AI.
                    </p>
                </div>
                <Button onClick={onSync} disabled={isSyncing}>
                    <RefreshCw className={isSyncing ? "animate-spin" : ""} />
                    {isSyncing ? "Syncing…" : "Sync repositories"}
                </Button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        aria-label="Search repositories"
                        className="pl-9"
                        placeholder="Search by name, owner, or description"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Select
                        value={visibility}
                        onValueChange={(value) => {
                            if (value === "ALL" || value === "PUBLIC" || value === "PRIVATE") {
                                onVisibilityChange(value);
                            }
                        }}
                    >
                        <SelectTrigger aria-label="Filter by visibility" className="w-full sm:w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All visibility</SelectItem>
                            <SelectItem value="PUBLIC">Public</SelectItem>
                            <SelectItem value="PRIVATE">Private</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={status}
                        onValueChange={(value) => {
                            const selected = statusOptions.find((option) => option.value === value);
                            if (selected) onStatusChange(selected.value);
                        }}
                    >
                        <SelectTrigger aria-label="Filter by indexing status" className="w-full sm:w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <p className="text-xs text-muted-foreground">
                {totalCount ?? 0} repositories · {readyCount} ready to use
            </p>
        </header>
    );
}
