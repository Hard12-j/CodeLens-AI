"use client";

import { AlertCircle, Link2, Palette, UserRound } from "lucide-react";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-auth";

export function SettingsDashboard() {
    const userQuery = useCurrentUser();

    if (userQuery.isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-52 rounded-2xl" />
                <Skeleton className="h-36 rounded-2xl" />
            </div>
        );
    }

    if (userQuery.isError || !userQuery.data) {
        return (
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>Unable to load account settings</EmptyTitle>
                    <EmptyDescription>
                        {userQuery.error instanceof Error
                            ? userQuery.error.message
                            : "Your account information is unavailable."}
                    </EmptyDescription>
                </EmptyHeader>
                <Button onClick={() => void userQuery.refetch()} variant="outline">
                    Try again
                </Button>
            </Empty>
        );
    }

    const user = userQuery.data;

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
                        <CardTitle>GitHub account</CardTitle>
                    </div>
                    <CardDescription>
                        Your connected identity used to access repositories.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {user.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                alt=""
                                className="size-12 rounded-full border object-cover"
                                height={48}
                                src={user.avatarUrl}
                                width={48}
                            />
                        ) : (
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-lg font-medium">
                                {user.displayName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate font-medium">{user.displayName}</p>
                            <p className="truncate text-sm text-muted-foreground">
                                <Link2 aria-hidden="true" className="mr-1 inline size-3.5" />
                                @{user.githubUsername}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette aria-hidden="true" className="size-4 text-muted-foreground" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                        Choose a light, dark, or system-matched theme for CodeLens AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">Color theme</p>
                    <ModeToggle />
                </CardContent>
            </Card>
        </div>
    );
}
