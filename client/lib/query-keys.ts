export const QueryKeys = {
    auth: {
        all: ["auth"] as const,
        me: () => [...QueryKeys.auth.all, "me"] as const,
    },
    repos: {
        all: ["repos"] as const,
        list: () => [...QueryKeys.repos.all, "list"] as const,
        details: (id: string) => [...QueryKeys.repos.all, "detail", id] as const,
        status: (id: string) => [...QueryKeys.repos.all, "status", id] as const,
    },
    chat: {
        all: ["chat"] as const,
        sessions: (repositoryId: string) => 
        [...QueryKeys.chat.all, "sessions", repositoryId] as const,
        messages: (sessionId: string) => 
            [...QueryKeys.chat.all, "messages", sessionId] as const,
    },
};