"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Cpu,
    Database,
    GitBranch,
    Layers,
    Lock,
    MessageSquareCode,
    Search,
    Shield,
    Sparkles,
    Terminal,
    Zap,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

import { useCurrentUser } from "@/hooks/use-auth";
import { getGithubLoginUrl } from "@/lib/api";

export default function HomePage() {
    const { data: user, isLoading } = useCurrentUser();

    return (
        <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
            {/* Background Grid & Ambient Glows */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.18),transparent_70%)]" />
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-cyan-600/5 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Navigation Bar */}
            <header className="relative z-20 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            <Sparkles className="size-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-base font-bold tracking-tight text-white">
                                CodeLens <span className="text-cyan-400">AI</span>
                            </span>
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                                v2.0
                            </span>
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-4 py-2 font-sans text-xs font-semibold text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:brightness-110 active:scale-95"
                            >
                                <span>Go to Dashboard</span>
                                <ArrowRight className="size-3.5" />
                            </Link>
                        ) : (
                            <a
                                href={getGithubLoginUrl()}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-zinc-900/90 px-4 py-2 font-sans text-xs font-semibold text-white shadow-sm transition-all hover:border-cyan-400/50 hover:bg-zinc-800 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] active:scale-95"
                            >
                                <GithubIcon className="size-3.5" />
                                <span>Sign In with GitHub</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Telemetry pill */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-cyan-500" />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider">
                            Neural Code Observatory & AST Vector RAG
                        </span>
                    </div>

                    {/* Hero Title */}
                    <h1 className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
                        Supercharge Your Understanding of{" "}
                        <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                            Any GitHub Codebase
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-5 text-base leading-relaxed text-zinc-400 sm:text-lg">
                        Connect private or public repositories. CodeLens chunks your files, embeds them into high-dimensional vector space with Google Gemini, and lets you interrogate architecture, logic, and bugs in real-time.
                    </p>

                    {/* Main CTA Deck */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                        <a
                            href={user ? "/dashboard" : getGithubLoginUrl()}
                            className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 px-6 font-sans text-sm font-semibold text-zinc-950 shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:brightness-110 hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-95 sm:w-auto"
                        >
                            <GithubIcon className="size-4" />
                            <span>{user ? "Open Dashboard" : "Connect with GitHub"}</span>
                            <ArrowRight className="size-4" />
                        </a>

                        <Link
                            href={user ? "/dashboard" : "/login"}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-zinc-900/80 px-5 font-sans text-sm font-medium text-zinc-200 backdrop-blur-md transition-all hover:border-white/[0.25] hover:bg-zinc-800 hover:text-white sm:w-auto"
                        >
                            <span>Explore Capabilities</span>
                        </Link>
                    </div>

                    {/* Quick trust metrics */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-cyan-400" />
                            OAuth 2.0 Scope Verified
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-emerald-400" />
                            PgVector 768-Dim Embeddings
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="size-3.5 text-teal-400" />
                            Token-Level AST Splitting
                        </span>
                    </div>
                </div>

                {/* Hologram Terminal Showcase */}
                <div className="mt-14 overflow-hidden rounded-2xl border border-white/[0.12] bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black p-2 shadow-[0_20px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                    {/* Window Controls */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-rose-500/80" />
                            <div className="size-3 rounded-full bg-amber-500/80" />
                            <div className="size-3 rounded-full bg-emerald-500/80" />
                            <span className="ml-2 font-mono text-xs text-zinc-500">
                                codelens://observatory/session-telemetry
                            </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                            <span className="flex size-2 rounded-full bg-emerald-400" />
                            <span>VECTOR DB: CONNECTED</span>
                        </div>
                    </div>

                    {/* Mock Chat / Telemetry Grid */}
                    <div className="grid gap-4 p-4 md:grid-cols-3">
                        {/* Column 1: Repo Tree Node */}
                        <div className="rounded-xl border border-white/[0.06] bg-black/50 p-4 font-mono text-xs">
                            <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800/80">
                                <span className="flex items-center gap-1.5">
                                    <GitBranch className="size-3.5 text-cyan-400" />
                                    <span>Repository Tree</span>
                                </span>
                                <span className="text-[10px] text-zinc-500">main</span>
                            </div>
                            <div className="mt-3 space-y-2 text-zinc-400 text-[11px]">
                                <div className="text-zinc-500">📁 backend/src/main/java</div>
                                <div className="pl-4 text-cyan-300">└─ 📄 indexingService.java</div>
                                <div className="pl-4 text-emerald-300">└─ 📄 CodeChunker.java</div>
                                <div className="pl-4 text-zinc-400">└─ 📄 RagSettings.java</div>
                                <div className="text-zinc-500">📁 client/components</div>
                                <div className="pl-4 text-amber-300">└─ 📄 repo-card.tsx</div>
                                <div className="pl-4 text-teal-300">└─ 📄 chat-view.tsx</div>
                            </div>
                        </div>

                        {/* Column 2: RAG Pipeline */}
                        <div className="rounded-xl border border-white/[0.06] bg-black/50 p-4 font-mono text-xs">
                            <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800/80">
                                <span className="flex items-center gap-1.5">
                                    <Database className="size-3.5 text-emerald-400" />
                                    <span>Vector Retrievable</span>
                                </span>
                                <span className="text-[10px] text-emerald-400">768 Dim</span>
                            </div>
                            <div className="mt-3 space-y-2.5 text-[11px]">
                                <div className="rounded border border-emerald-500/20 bg-emerald-950/30 p-2 text-emerald-300">
                                    <div className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Matched Chunk #1 (Cosine: 0.94)</div>
                                    <div className="mt-1 font-mono text-[10px] text-zinc-300 line-clamp-2">
                                        vectorStore.similaritySearch(SearchRequest.builder().query(question)...)
                                    </div>
                                </div>
                                <div className="rounded border border-cyan-500/20 bg-cyan-950/30 p-2 text-cyan-300">
                                    <div className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Matched Chunk #2 (Cosine: 0.89)</div>
                                    <div className="mt-1 font-mono text-[10px] text-zinc-300 line-clamp-2">
                                        codeChunker.chunkFile(repoId, path, content)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Synthesized AI Answer */}
                        <div className="rounded-xl border border-white/[0.06] bg-black/50 p-4 font-mono text-xs">
                            <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800/80">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="size-3.5 text-cyan-400" />
                                    <span>Neural Synthesis</span>
                                </span>
                                <span className="text-[10px] text-cyan-400">Groq LPU</span>
                            </div>
                            <div className="mt-3 space-y-2 text-zinc-300 font-sans text-xs leading-relaxed">
                                <div className="rounded-lg bg-zinc-900/80 p-2 text-zinc-400 text-[11px]">
                                    <span className="text-cyan-400 font-bold font-mono">User:</span> How does repository indexing work in this codebase?
                                </div>
                                <p className="text-[11px] text-zinc-300 leading-normal">
                                    Indexing uses an async thread pool (`IndexingExecutor`) that pulls GitHub file trees recursively, filters non-code extensions, and splits files with `TokenTextSplitter` into PgVector embeddings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                            <Layers className="size-5" />
                        </div>
                        <h3 className="mt-4 font-sans text-sm font-bold text-white">Smart AST Chunking</h3>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            Respects language boundaries, comments, and structure so code vectors retain semantic context.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
                            <Zap className="size-5" />
                        </div>
                        <h3 className="mt-4 font-sans text-sm font-bold text-white">Streaming Real-Time RAG</h3>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            Receive lightning-fast SSE streaming answers grounded with exact file and line citations.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/40 text-amber-400">
                            <Lock className="size-5" />
                        </div>
                        <h3 className="mt-4 font-sans text-sm font-bold text-white">Private Repositories</h3>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            Full AES encryption on OAuth access tokens guarantees your private code never leaks.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/60 p-6 backdrop-blur-md">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-400">
                            <Terminal className="size-5" />
                        </div>
                        <h3 className="mt-4 font-sans text-sm font-bold text-white">Interactive File Explorer</h3>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                            Browse the live GitHub file tree right alongside your conversation to audit any module.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.08] bg-zinc-950/80 py-8 text-center text-xs text-zinc-500 font-mono">
                CodeLens AI · Built with Spring Boot 3, PgVector, Next.js & Google Gemini
            </footer>
        </div>
    );
}
