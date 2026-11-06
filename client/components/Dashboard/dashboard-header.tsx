"use client";

import {
    Activity,
    CheckCircle2,
    Database,
    FolderGit2,
    LayoutGrid,
    List,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Sparkles,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
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
export type DashboardViewMode = "grid" | "list";

type DashboardHeaderProps = {
    search: string;
    onSearchChange: (value: string) => void;
    visibility: RepositoryVisibilityFilter;
    onVisibilityChange: (value: RepositoryVisibilityFilter) => void;
    status: RepositoryStatusFilter;
    onStatusChange: (value: RepositoryStatusFilter) => void;
    totalCount?: number;
    readyCount: number;
    indexingCount?: number;
    onSync: () => void;
    isSyncing: boolean;
    viewMode: DashboardViewMode;
    onViewModeChange: (mode: DashboardViewMode) => void;
};

const statusOptions: { value: RepositoryStatusFilter; label: string }[] = [
    { value: "ALL", label: "All Repositories" },
    { value: "READY", label: "Indexed & Ready" },
    { value: "INDEXING", label: "Currently Indexing" },
    { value: "PENDING", label: "Unindexed / Standby" },
    { value: "FAILED", label: "Failed / Attention" },
];

export function DashboardHeader({
    search,
    onSearchChange,
    visibility,
    onVisibilityChange,
    status,
    onStatusChange,
    totalCount = 0,
    readyCount = 0,
    indexingCount = 0,
    onSync,
    isSyncing,
    viewMode,
    onViewModeChange,
}: DashboardHeaderProps) {
    const unindexedCount = Math.max(0, totalCount - readyCount - indexingCount);

    return (
        <header className="relative border-b border-white/[0.08] bg-zinc-950/70 px-3.5 py-4 backdrop-blur-xl sm:px-6 md:px-8 sm:py-5">
            {/* Ambient top light */}
            <div className="pointer-events-none absolute inset-x-0 -top-20 h-24 bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-indigo-500/10 blur-3xl" />

            {/* Top row: Title + Telemetry Stats + Sync Button */}
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="text-zinc-400 hover:text-white md:hidden shrink-0 -ml-1 mr-1" />
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                            <Sparkles className="size-3.5" />
                        </span>
                        <h1 className="truncate font-sans text-lg font-bold tracking-tight text-white sm:text-xl md:text-2xl">
                            Codebase Observatory
                        </h1>
                        <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-950/50 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-400">
                            Neural RAG
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-400">
                        Index, query, and synthesize knowledge from your connected GitHub codebases.
                    </p>
                </div>

                {/* Right controls: Mini telemetry strip + Sync button */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Live telemetry counters */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/60 p-1 sm:p-1.5 font-mono text-[11px] sm:text-xs backdrop-blur-md">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-950/80 text-zinc-300 border border-zinc-800/60">
                            <FolderGit2 className="size-3 sm:size-3.5 text-zinc-400" />
                            <span>{totalCount} repos</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 className="size-3 sm:size-3.5 text-emerald-400" />
                            <span>{readyCount} indexed</span>
                        </div>
                        {indexingCount > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 animate-pulse">
                                <Activity className="size-3 sm:size-3.5 text-cyan-400" />
                                <span>{indexingCount} scanning</span>
                            </div>
                        )}
                    </div>

                    {/* Sync button */}
                    <button
                        onClick={onSync}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.12] bg-zinc-900/90 px-3 py-1.5 sm:px-3.5 sm:py-2 font-sans text-xs font-medium text-zinc-200 shadow-sm transition-all hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-white active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`size-3.5 text-cyan-400 ${isSyncing ? "animate-spin" : ""}`} />
                        <span>{isSyncing ? "Syncing..." : "Sync Repos"}</span>
                    </button>
                </div>
            </div>

            {/* Bottom row: Command Search + Filters + View Mode Switcher */}
            <div className="mt-4 sm:mt-5 flex flex-col gap-2.5 sm:gap-3 md:flex-row md:items-center">
                {/* Search Bar */}
                <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        aria-label="Search repositories"
                        className="h-9 sm:h-10 w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 pl-10 pr-4 text-xs font-sans text-zinc-100 placeholder-zinc-500 backdrop-blur-md transition-all focus:border-cyan-500/50 focus:bg-zinc-900/90 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                        placeholder="Search repository, owner, or stack..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border border-zinc-700 bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">
                        /
                    </kbd>
                </div>

                {/* Filter and View dropdowns */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Visibility Filter */}
                    <Select
                        value={visibility}
                        onValueChange={(value) => {
                            if (value === "ALL" || value === "PUBLIC" || value === "PRIVATE") {
                                onVisibilityChange(value);
                            }
                        }}
                    >
                        <SelectTrigger
                            aria-label="Filter by visibility"
                            className="h-9 sm:h-10 flex-1 min-w-[130px] sm:w-36 rounded-xl border-white/[0.08] bg-zinc-900/60 text-xs text-zinc-300 hover:border-white/[0.18]"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
                            <SelectItem value="ALL">All Visibility</SelectItem>
                            <SelectItem value="PUBLIC">Public Only</SelectItem>
                            <SelectItem value="PRIVATE">Private Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            const selected = statusOptions.find((opt) => opt.value === value);
                            if (selected) onStatusChange(selected.value);
                        }}
                    >
                        <SelectTrigger
                            aria-label="Filter by status"
                            className="h-9 sm:h-10 flex-1 min-w-[145px] sm:w-44 rounded-xl border-white/[0.08] bg-zinc-900/60 text-xs text-zinc-300 hover:border-white/[0.18]"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-800 bg-zinc-950 text-zinc-200">
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* View Switcher: Grid vs List */}
                    <div className="flex items-center rounded-xl border border-white/[0.08] bg-zinc-900/60 p-1 shrink-0">
                        <button
                            type="button"
                            onClick={() => onViewModeChange("grid")}
                            aria-label="Grid view"
                            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg transition-colors ${
                                viewMode === "grid"
                                    ? "bg-cyan-500/20 text-cyan-400 shadow-xs"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            <LayoutGrid className="size-3.5 sm:size-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onViewModeChange("list")}
                            aria-label="List view"
                            className={`flex size-7 sm:size-8 items-center justify-center rounded-lg transition-colors ${
                                viewMode === "list"
                                    ? "bg-cyan-500/20 text-cyan-400 shadow-xs"
                                    : "text-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            <List className="size-3.5 sm:size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
