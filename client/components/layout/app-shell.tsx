"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, Sparkles } from "lucide-react";
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
    useSidebar,
} from "@/components/ui/sidebar";
import { dashboardNavGroups, isDashboardNavActive } from "@/lib/dashboard-nav";
import { cn } from "cn";

export type AppShellProps = {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    hideHeader?: boolean;
    noPadding?: boolean;
    contentClassName?: string;
};

function AppShellInner({
    children,
    title,
    description,
    actions,
    hideHeader = false,
    noPadding = false,
    contentClassName,
}: AppShellProps) {
    const pathname = usePathname();
    const { data: user } = useCurrentUser();
    const logout = useLogout();
    const { isMobile, setOpenMobile } = useSidebar();

    const handleNavClick = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <>
            <Sidebar
                variant="inset"
                collapsible="icon"
                className="border-r border-white/[0.06] bg-black text-zinc-300"
            >
                <SidebarHeader className="border-b border-white/[0.06] p-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href="/dashboard" onClick={handleNavClick} />}
                                tooltip="CodeLens AI"
                                className="hover:bg-zinc-900/80 active:bg-zinc-900 transition-all rounded-xl"
                            >
                                <div className="flex size-8 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                                    <Sparkles className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-sans font-bold tracking-tight text-white">
                                        CodeLens <span className="text-cyan-400">AI</span>
                                    </span>
                                    <span className="truncate font-mono text-[10px] text-zinc-500">
                                        // RAG Observatory
                                    </span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="px-2 py-4">
                    {dashboardNavGroups.map((group) => (
                        <SidebarGroup key={group.label}>
                            <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 px-3">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="mt-1 space-y-1">
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
                                                    render={<Link href={item.href} onClick={handleNavClick} />}
                                                    className={cn(
                                                        "rounded-xl transition-all duration-200",
                                                        active
                                                            ? "bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-300 font-medium border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60"
                                                    )}
                                                >
                                                    <Icon className={cn("size-4", active ? "text-cyan-400" : "text-zinc-400")} />
                                                    <span className="text-xs font-sans">{item.title}</span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="border-t border-white/[0.06] p-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex items-center gap-1">
                                <div className="pointer-events-none flex min-w-0 flex-1 select-none items-center gap-2.5 overflow-hidden p-2">
                                    {user?.avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            alt={user.displayName}
                                            className="size-7 rounded-lg border border-cyan-500/30 object-cover"
                                            src={user.avatarUrl}
                                        />
                                    ) : (
                                        <div className="flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-zinc-900 text-xs font-mono font-bold text-cyan-400">
                                            {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                                        </div>
                                    )}
                                    <div className="grid min-w-0 flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-sans font-medium text-white">
                                            {user?.displayName ?? "User"}
                                        </span>
                                        <span className="truncate font-mono text-[10px] text-zinc-500">
                                            @{user?.githubUsername ?? "github"}
                                        </span>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleNavClick();
                                        logout.mutate();
                                    }}
                                    aria-label="Log out"
                                    title="Log out"
                                    className="shrink-0 rounded-lg p-2 text-zinc-500 transition-colors hover:bg-rose-950/40 hover:text-rose-400 group-data-[collapsible=icon]:hidden"
                                >
                                    <LogOut className="size-4" />
                                </button>
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-black text-zinc-100 min-h-screen">
                {!hideHeader && (
                    <header className="sticky top-0 z-30 flex h-14 sm:h-16 shrink-0 items-center gap-2 sm:gap-3 border-b border-white/[0.06] bg-black/70 px-3 sm:px-6 backdrop-blur-xl">
                        <SidebarTrigger className="text-zinc-400 hover:text-white md:hidden shrink-0" />
                        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:gap-3">
                            <div className="min-w-0 flex-1">
                                {title && (
                                    <h1 className="truncate font-sans text-sm sm:text-lg font-bold tracking-tight text-white">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="truncate font-mono text-[10px] sm:text-xs text-zinc-400">{description}</p>
                                )}
                            </div>
                            {actions && <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">{actions}</div>}
                        </div>
                    </header>
                )}

                <main className={cn("flex-1 bg-black", noPadding ? "flex flex-col min-h-0 overflow-hidden" : "overflow-auto")}>
                    <div className={cn(
                        noPadding 
                            ? "flex-1 flex flex-col min-h-0 w-full" 
                            : "mx-auto w-full max-w-7xl p-3 sm:p-6 lg:p-8", 
                        !hideHeader && !noPadding && "pt-4 sm:pt-6",
                        contentClassName
                    )}>
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </>
    );
}

export function AppShell(props: AppShellProps) {
    return (
        <SidebarProvider>
            <AppShellInner {...props} />
        </SidebarProvider>
    );
}
