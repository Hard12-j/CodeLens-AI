"use client";

import { OverviewDashboard } from "@/components/Dashboard/overview-dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/components/providers/require-auth";

export default function OverviewPage() {
    return (
        <RequireAuth>
            <AppShell
                description="A snapshot of your connected repositories and indexing activity."
                title="Overview"
            >
                <OverviewDashboard />
            </AppShell>
        </RequireAuth>
    );
}
