import { CheckCircle2, CircleDashed, CircleX, LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { IndexStatus } from "@/lib/api";

const statusDetails: Record<
    IndexStatus,
    {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
        Icon: typeof CheckCircle2;
    }
> = {
    PENDING: { label: "Not indexed", variant: "outline", Icon: CircleDashed },
    INDEXING: { label: "Indexing", variant: "secondary", Icon: LoaderCircle },
    READY: { label: "Ready", variant: "default", Icon: CheckCircle2 },
    FAILED: { label: "Failed", variant: "destructive", Icon: CircleX },
};

export function RepoStatus({ status }: { status: IndexStatus }) {
    const { label, variant, Icon } = statusDetails[status] ?? statusDetails.PENDING;

    return (
        <Badge variant={variant}>
            <Icon aria-hidden="true" className={status === "INDEXING" ? "animate-spin" : ""} />
            {label}
        </Badge>
    );
}
