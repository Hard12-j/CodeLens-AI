"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import DevPilotIcon from "@/components/icons/DevPilotIcon";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";
import { cn } from "cn";
import React from "react";

export function AppShell({
    children,
    title,
    description,
    actions,
    hideHeader = false,
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    hideHeader?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user } = useCurrentUser();
    const logout = useLogout();

    return (
        <SidebarProvider>
            <Sidebar variant="inset" collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href="/dashboard" />}
                                tooltip="CodeLens AI"
                            >
                                <DevPilotIcon className="size-8 rounded-[10px]" />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">CodeLens AI</span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        Chat with your code
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    {dashboardNavGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isDashboardNavActive(
                                            pathname,
                                            item.href,
                                            item.exact
                                        );

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    isActive={active}
                                                    tooltip={item.title}
                                                    render={<Link href={item.href} />}
                                                >
                                                    <Icon className="size-4" />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    render={<SidebarMenuButton className="w-full" size="sm" />}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                                            {user?.displayName.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                        <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">
                                                {user?.displayName ?? "User"}
                                            </span>
                                            <span className="truncate text-[10px] text-muted-foreground">
                                                Online
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="start" className="w-56">
                                    <DropdownMenuLabel>My account</DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                                            <Settings className="mr-2 size-4" />
                                            Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout.mutate()}>
                                        <LogOut className="mr-2 size-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                {!hideHeader && (
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-sm">
                        <SidebarTrigger className="md:hidden" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                            <div className="min-w-0">
                                {title && <h1 className="truncate text-lg font-semibold">{title}</h1>}
                                {description && (
                                    <p className="truncate text-sm text-muted-foreground">{description}</p>
                                )}
                            </div>
                            {actions && <div className="flex items-center gap-2">{actions}</div>}
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-auto">
                    <div className={cn("mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8", !hideHeader && "pt-6")}>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
