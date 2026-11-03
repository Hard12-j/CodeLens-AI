import { Code2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function LanguageBadge({ language }: { language: string | null }) {
    if (!language?.trim()) return null;

    return (
        <Badge className="gap-1.5" variant="outline">
            <Code2 aria-hidden="true" />
            {language}
        </Badge>
    );
}
