import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type IndexErrorAlertProps = {
    message?: string | null;
    onRetry?: () => void;
    isRetrying?: boolean;
};

export function IndexErrorAlert({
    message,
    onRetry,
    isRetrying = false,
}: IndexErrorAlertProps) {
    return (
        <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>Repository indexing failed</AlertTitle>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
                <span>{message || "The repository could not be indexed. Try again later."}</span>
                {onRetry && (
                    <Button
                        disabled={isRetrying}
                        onClick={onRetry}
                        size="sm"
                        variant="outline"
                    >
                        {isRetrying ? "Retrying…" : "Try again"}
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
