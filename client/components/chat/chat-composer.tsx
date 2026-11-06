"use client"

import { ArrowUp, CornerDownLeft, Sparkles, Square } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const STARTER_PROMPTS = [
    { label: "⚡ Architecture Overview", prompt: "Explain the high-level architecture and core components of this repository." },
    { label: "🔍 Security & Vulnerabilities", prompt: "Audit this codebase for potential security concerns, unhandled exceptions, or vulnerabilities." },
    { label: "📦 Key Dependencies & APIs", prompt: "Summarize the primary external dependencies, REST APIs, and data models used here." },
    { label: "💡 How to Run & Test", prompt: "How do I build, configure, run, and test this project locally?" },
]

export function ChatComposer({
    disable = false,
    streaming = false,
    initialPrompt = "",
    onSend,
    onStop,
}: {
    disable?: boolean
    streaming?: boolean
    initialPrompt?: string
    onSend?: (content: string) => void | Promise<void>
    onStop?: () => void
}) {
    const [value, setValue] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (initialPrompt) {
            setValue(initialPrompt)
            textareaRef.current?.focus()
        }
    }, [initialPrompt])

    const submit = async () => {
        const nextValue = value.trim()
        if (!nextValue || disable) return

        setValue("")
        await onSend?.(nextValue)
    }

    const handlePromptChip = (prompt: string) => {
        setValue(prompt)
        textareaRef.current?.focus()
    }

    return (
        <div className="border-t border-white/[0.08] bg-black/60 p-3 md:p-4 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl space-y-2.5">
                {/* Starter Prompt Chips */}
                {!value && (
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {STARTER_PROMPTS.map(({ label, prompt }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => handlePromptChip(prompt)}
                                disabled={disable}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-zinc-900/60 px-3 py-1 font-mono text-[11px] text-zinc-400 hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-cyan-300 transition-all disabled:opacity-40"
                            >
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Composer Box */}
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black p-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault()
                                void submit()
                            }
                        }}
                        disabled={disable}
                        rows={3}
                        className="max-h-36 min-h-[72px] w-full resize-none border-0 bg-transparent px-3 py-1.5 font-sans text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed"
                        placeholder={
                            disable
                                ? "Initializing session or waiting for indexing..."
                                : "Ask any question about this codebase, architecture, or functions..."
                        }
                    />

                    <div className="flex items-center justify-between gap-3 px-2 pt-1.5 border-t border-zinc-800/60">
                        <p className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
                            <span>Press</span>
                            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.2 text-[10px] text-zinc-400">
                                Enter
                            </kbd>
                            <span>to query ·</span>
                            <kbd className="rounded border border-zinc-700 bg-zinc-800 px-1 py-0.2 text-[10px] text-zinc-400">
                                Shift + Enter
                            </kbd>
                            <span>newline</span>
                        </p>

                        {streaming && onStop ? (
                            <button
                                type="button"
                                onClick={onStop}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-950/50 px-3 py-1.5 font-mono text-xs text-rose-300 hover:bg-rose-900/60 transition-all active:scale-95"
                            >
                                <Square className="size-3 fill-current" />
                                <span>Stop Stream</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                disabled={disable || !value.trim()}
                                onClick={() => void submit()}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 px-3.5 py-1.5 font-sans text-xs font-semibold text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <span>Ask AI</span>
                                <ArrowUp className="size-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
