"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import ChatView from "@/components/chat/chat-view";
import { RequireAuth } from "@/components/providers/require-auth";
import { Loader2 } from "lucide-react";

function ChatPageContent() {
    const params = useParams();
    const repoId =
        typeof params?.repoId === "string"
            ? params.repoId
            : Array.isArray(params?.repoId)
              ? params.repoId[0]
              : "";

    return (
        <RequireAuth>
            <ChatView repoId={repoId} />
        </RequireAuth>
    );
}

export default function ChatPage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center bg-black">
                    <Loader2 className="size-6 animate-spin text-cyan-400" />
                </div>
            }
        >
            <ChatPageContent />
        </Suspense>
    );
}
