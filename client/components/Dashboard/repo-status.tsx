"use client";

import { Activity, AlertTriangle, Check, Loader2 } from "lucide-react";
import type { IndexStatus } from "@/lib/api";

type RepoStatusProps = {
    status: IndexStatus;
    className?: string;
    showIcon?: boolean;
};

export function RepoStatus({ status, className = "", showIcon = true }: RepoStatusProps) {
    if (status === "READY") {
        return (
            <div
                className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)] backdrop-blur-md ${className}`}
            >
                {showIcon && (
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                )}
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                    Indexed
                </span>
            </div>
        );
    }

    if (status === "INDEXING") {
        return (
            <div
                className={`inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/50 px-2.5 py-1 text-[11px] font-medium tracking-wide text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] backdrop-blur-md ${className}`}
            >
                {showIcon && <Loader2 className="size-3 animate-spin text-cyan-400" />}
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                    Vectorizing
                </span>
            </div>
        );
    }

    if (status === "FAILED") {
        return (
            <div
                className={`inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)] backdrop-blur-md ${className}`}
            >
                {showIcon && <AlertTriangle className="size-3 text-rose-400" />}
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider">
                    Index Failed
                </span>
            </div>
        );
    }

    // Default: PENDING / NOT INDEXED
    return (
        <div
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-zinc-400 backdrop-blur-md ${className}`}
        >
            {showIcon && <span className="size-1.5 rounded-full bg-amber-500/70" />}
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider">
                Unindexed
            </span>
        </div>
    );
}
