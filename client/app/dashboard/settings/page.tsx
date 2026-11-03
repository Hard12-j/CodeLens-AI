"use client";

import { SettingsDashboard } from "@/components/Dashboard/settings-dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/components/providers/require-auth";

export default function SettingsPage() {
    return (
        <RequireAuth>
            <AppShell
                description="Manage your connected account and appearance."
                title="Settings"
            >
                <SettingsDashboard />
            </AppShell>
        </RequireAuth>
    );
}
