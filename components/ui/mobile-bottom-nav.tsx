"use client";

import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EnhancedDrawer as Drawer, DrawerContent } from "@/components/ui/enhanced-drawer";
import {
  HomeIcon,
  LineChartIcon,
  TableIcon,
  PanelsTopLeftIcon,
  LayoutDashboardIcon,
  CarIcon,
  ZapIcon,
  BarChart3Icon,
  TrendingDownIcon,
  ClipboardListIcon,
  DatabaseIcon,
} from "lucide-react";

interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const scrollTo = useCallback((targetId: string) => {
    if (targetId === 'dashboard-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const navElement = (
    <nav
      className={cn(
        "md:hidden fixed inset-x-0 bottom-0 z-[1000]",
        "bg-black/40",
        "border-t border-white/10",
        "rounded-t-2xl overflow-hidden",
        "px-2",
        className
      )}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom))" }}
      aria-label="Mobile bottom navigation"
    >
      {/* Glass effect layers */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-t-2xl pointer-events-none" />
      <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-50 pointer-events-none" />
      <div className="absolute inset-0 rounded-t-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
      <div className="relative mx-auto flex max-w-3xl items-stretch py-2">
        <Button
          variant="ghost"
          className="flex h-12 flex-1 flex-col items-center justify-center gap-1 px-2 text-xs text-neutral-300 hover:text-white"
          onClick={() => scrollTo("dashboard-top")}
        >
          <HomeIcon className="h-5 w-5" />
          Home
        </Button>
        <div className="mx-1 w-px self-stretch bg-white/10" aria-hidden />
        <Button
          variant="ghost"
          className="flex h-12 flex-1 flex-col items-center justify-center gap-1 px-4 mr-3 text-xs text-neutral-300 hover:text-white"
          onClick={() => scrollTo("dashboard-chart")}
        >
          <LineChartIcon className="h-5 w-5" />
          Chart
        </Button>
        <div className="mx-1 w-px self-stretch bg-white/10" aria-hidden />
        <Button
          variant="ghost"
          className="flex h-12 flex-1 flex-col items-center justify-center gap-1 px-4 ml-3 text-xs text-neutral-300 hover:text-white"
          onClick={() => scrollTo("dashboard-table")}
        >
          <TableIcon className="h-5 w-5" />
          Table
        </Button>
        <div className="mx-1 w-px self-stretch bg-white/10" aria-hidden />
        <Button
          variant="ghost"
          className="flex h-12 flex-1 flex-col items-center justify-center gap-1 px-2 text-xs text-neutral-300 hover:text-white"
          onClick={() => scrollTo("dashboard-top")}
        >
          <PanelsTopLeftIcon className="h-5 w-5" />
          Menu
        </Button>

        {/* Floating round button via portal to escape nav stacking context */}
        {mounted
          ? createPortal(
              <div className="pointer-events-none fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-[1002] md:hidden" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}>
                <Button
                  type="button"
                  size="icon"
                  className="pointer-events-auto relative h-16 w-16 rounded-full bg-green-600 text-white ring-2 ring-white ring-offset-2 ring-offset-black shadow-lg hover:bg-green-500"
                  onClick={() => setOpen(true)}
                  aria-label="Open quick menu"
                >
                  <div className="flex flex-col items-center justify-center leading-none">
                    <PanelsTopLeftIcon className="h-6 w-6 mb-0.5" />
                    <span className="text-[10px] font-medium">Menu</span>
                  </div>
                </Button>
              </div>,
              document.body
            )
          : null}
      </div>

      {/* Mobile quick menu drawer with animation */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          side="bottom"
          overlayBottomOffset={"calc(env(safe-area-inset-bottom) + 64px)"}
          contentBottomOffset={64}
          overlayZIndex={800}
          contentZIndex={900}
          overlayClassName="pointer-events-none"
          className="bg-black/90 text-white rounded-2xl border border-white/10 md:hidden overflow-hidden"
        >
          {/* Enhanced green gradients: corners + edges */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-30 [background:radial-gradient(180px_130px_at_0%_0%,rgba(34,197,94,0.28),transparent_60%),radial-gradient(180px_130px_at_100%_0%,rgba(34,197,94,0.28),transparent_60%),radial-gradient(180px_130px_at_0%_100%,rgba(34,197,94,0.18),transparent_60%),radial-gradient(180px_130px_at_100%_100%,rgba(34,197,94,0.18),transparent_60%),linear-gradient(to_right,rgba(34,197,94,0.08),transparent_35%,transparent_65%,rgba(34,197,94,0.08)),linear-gradient(to_bottom,rgba(34,197,94,0.06),transparent_35%,transparent_65%,rgba(34,197,94,0.06))]"
          />
          <SheetHeader>
            <SheetTitle className="text-white">Quick Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-3 space-y-2" role="menu" aria-label="Mobile navigation">
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-top'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <LayoutDashboardIcon className="h-5 w-5 text-neutral-300" />
              <span>Dashboard</span>
            </button>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-cards'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <CarIcon className="h-5 w-5 text-neutral-300" />
              <span>Transportation</span>
            </button>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-cards'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <ZapIcon className="h-5 w-5 text-neutral-300" />
              <span>Energy Usage</span>
            </button>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-chart'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <BarChart3Icon className="h-5 w-5 text-neutral-300" />
              <span>Analytics</span>
            </button>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-cards'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <TrendingDownIcon className="h-5 w-5 text-neutral-300" />
              <span>Reduction Goals</span>
            </button>
            <div className="pt-2 text-xs uppercase text-neutral-400 px-3">Documents</div>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-table'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <ClipboardListIcon className="h-5 w-5 text-neutral-300" />
              <span>Carbon Reports</span>
            </button>
            <button type="button" onClick={() => { setOpen(false); scrollTo('dashboard-table'); }} className="w-full rounded-lg px-3 py-3 text-left hover:bg-white/10 flex items-center gap-3">
              <DatabaseIcon className="h-5 w-5 text-neutral-300" />
              <span>Data Export</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );

  return mounted ? createPortal(navElement, document.body) : navElement;
}

export default MobileBottomNav;


