"use client";

import { use, Suspense } from "react";
import ChatView from "@/components/chat/chat-view";
import { RequireAuth } from "@/components/providers/require-auth";
import { Loader2 } from "lucide-react";

function ChatPageContent({ params }: { params: Promise<{ repoId: string }> }) {
    const { repoId } = use(params);
    return (
        <RequireAuth>
            <ChatView repoId={repoId} />
        </RequireAuth>
    );
}

export default function ChatPage({
    params,
}: {
    params: Promise<{ repoId: string }>;
}) {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
            }
        >
            <ChatPageContent params={params} />
        </Suspense>
    );
}
