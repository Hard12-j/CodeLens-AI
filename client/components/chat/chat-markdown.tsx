import { cn } from "cn"

import "@/components/chat/chat-markdown.css"

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;")
}

function renderInlineMarkdown(value: string) {
    let html = escapeHtml(value)

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')

    return html
}

function renderMarkdownToHtml(content: string) {
    const normalized = content.replace(/\r\n/g, "\n")
    const blocks = normalized.split(/\n{2,}/).filter((block) => block.trim().length > 0)

    return blocks
        .map((block) => {
            const lines = block.split("\n")
            const trimmed = block.trim()

            if (trimmed.startsWith("```")) {
                const match = trimmed.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/)
                if (match) {
                    const language = match[1] || "text"
                    const code = escapeHtml(match[2])
                    return `<pre class="language-${language}"><code>${code}</code></pre>`
                }
                return `<pre><code>${escapeHtml(trimmed.replace(/^```/g, "").replace(/```$/g, ""))}</code></pre>`
            }

            if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
                const items = lines
                    .map((line) => line.replace(/^\s*[-*]\s+/, ""))
                    .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
                    .join("")
                return `<ul>${items}</ul>`
            }

            if (lines.every((line) => /^\s*\d+\.\s+/.test(line))) {
                const items = lines
                    .map((line) => line.replace(/^\s*\d+\.\s+/, ""))
                    .map((line) => `<li>${renderInlineMarkdown(line)}</li>`)
                    .join("")
                return `<ol>${items}</ol>`
            }

            if (lines.every((line) => /^\s*>\s?/.test(line))) {
                const quote = lines
                    .map((line) => renderInlineMarkdown(line.replace(/^\s*>\s?/, "")))
                    .join("<br />")
                return `<blockquote>${quote}</blockquote>`
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/)
            if (headingMatch) {
                const level = headingMatch[1].length
                const text = renderInlineMarkdown(headingMatch[2])
                return `<h${level}>${text}</h${level}>`
            }

            return `<p>${renderInlineMarkdown(trimmed).replace(/\n/g, "<br />")}</p>`
        })
        .join("")
}

export function ChatMarkdown({
    content,
    className,
}: {
    content: string
    className?: string
}) {
    return (
        <div
            className={cn("chat-markdown", className)}
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(content || "") }}
        />
    )
}
