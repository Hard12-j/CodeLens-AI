"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Lock, Sparkles, Terminal } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

import { useCurrentUser } from "@/hooks/use-auth";
import { getGithubLoginUrl } from "@/lib/api";

function LoginLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-3">
                <div className="size-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
                <span className="font-mono text-xs text-zinc-500">// Authenticating session...</span>
            </div>
        </div>
    );
}

function LoginContent() {
    const params = useSearchParams();
    const router = useRouter();
    const error = params.get("error");
    const next = params.get("next") || "/dashboard";

    const { data: user, isLoading } = useCurrentUser();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace(next.startsWith("/") ? next : "/dashboard");
        }
    }, [user, isLoading, next, router]);

    if (isLoading || user) {
        return <LoginLoading />;
    }

    return (
        <div className="relative flex min-h-screen flex-col justify-between bg-black text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Background optics */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(6,182,212,0.2),transparent_70%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Top Bar */}
            <header className="relative z-10 flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
                <Link href="/" className="flex items-center gap-2 sm:gap-2.5">
                    <span className="flex size-7 sm:size-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                        <Sparkles className="size-3.5 sm:size-4" />
                    </span>
                    <span className="font-sans text-sm sm:text-base font-bold tracking-tight text-white">
                        CodeLens <span className="text-cyan-400">AI</span>
                    </span>
                </Link>

                <Link
                    href="/"
                    className="font-mono text-xs text-zinc-400 hover:text-white transition-colors"
                >
                    &larr; Back to Home
                </Link>
            </header>

            {/* Login Center Pod */}
            <main className="relative z-10 flex flex-1 items-center justify-center p-3.5 sm:p-4">
                <div className="w-full max-w-md overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto flex size-12 sm:size-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                            <GithubIcon className="size-6 sm:size-7" />
                        </div>
                        <h2 className="mt-4 sm:mt-5 font-sans text-xl sm:text-2xl font-bold tracking-tight text-white">
                            Connect GitHub
                        </h2>
                        <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-zinc-400">
                            Authorize CodeLens AI to read your public and private repositories for vector indexing and chat.
                        </p>
                    </div>

                    {/* Error Notice */}
                    {error && (
                        <div className="mt-5 sm:mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 sm:p-3.5 text-xs text-rose-300">
                            <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                            <div>
                                <p className="font-bold">Authentication failed</p>
                                <p className="mt-0.5 text-zinc-400">
                                    {error === "oauth_failed"
                                        ? "GitHub authorization failed. Verify GITHUB_CLIENT_ID and callback settings."
                                        : error === "session"
                                          ? "Could not verify session with backend server on port 8080."
                                          : `Error: ${error}`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action button */}
                    <div className="mt-6 sm:mt-7">
                        <a
                            href={getGithubLoginUrl()}
                            className="inline-flex h-11 sm:h-12 w-full items-center justify-center gap-2.5 sm:gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 px-4 sm:px-5 font-sans text-sm font-semibold text-zinc-950 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all hover:brightness-110 active:scale-95"
                        >
                            <GithubIcon className="size-4 sm:size-5" />
                            <span>Continue with GitHub</span>
                        </a>
                    </div>

                    {/* Telemetry info */}
                    <div className="mt-6 sm:mt-8 border-t border-zinc-800/80 pt-5 sm:pt-6 space-y-2 sm:space-y-2.5 font-mono text-[10px] sm:text-[11px] text-zinc-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-3.5 text-cyan-400 shrink-0" />
                            <span>Read-only repository access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="size-3.5 text-emerald-400 shrink-0" />
                            <span>OAuth access tokens encrypted at rest</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Terminal className="size-3.5 text-teal-400 shrink-0" />
                            <span>Instant webhook & tree synchronization</span>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center font-mono text-xs text-zinc-600">
                CodeLens AI · Secure GitHub OAuth 2.0
            </footer>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<LoginLoading />}>
            <LoginContent />
        </Suspense>
    );
}
