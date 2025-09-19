'use client';

import { useState } from 'react';
import { Separator } from "@/components/ui/separator"
import { LeafIcon } from 'lucide-react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/ui/logout-dialog"
import { LogOutIcon, Loader2Icon } from 'lucide-react'
import { useUser } from '@/contexts/UserContext'

export function SiteHeader() {
  // Removed page-local overlay; page handles loading. Keep minimal state if needed later.
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { isLoggingOut, logout } = useUser();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;
    setShowLogoutDialog(false);
    await logout();
  };

  // completion handled at page level

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      {/* Mobile header: simplified, fixed, larger sizing; no sidebar trigger */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 flex h-14 shrink-0 items-center border-b border-white/10 px-4 backdrop-blur supports-[backdrop-filter]:bg-black/60 bg-black/80">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LeafIcon className="w-5 h-5 text-green-500" />
            <h1 className="text-base font-semibold text-white">Dashboard</h1>
          </div>
          <Button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Logout"
          >
            {isLoggingOut ? (
              <Loader2Icon className="w-5 h-5 animate-spin" />
            ) : (
              <LogOutIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Desktop header */}
      <header className="hidden md:flex group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 h-12 shrink-0 items-center gap-2 border-b border-white/10 transition-[width,height] ease-linear">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4 bg-white/10 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.05),inset_0_-1px_0_0_rgba(0,0,0,0.35)]" />
          <div className="flex items-center gap-2">
            <LeafIcon className="w-5 h-5 text-green-500" />
            <h1 className="text-base font-medium text-white">Carbon Footprint Dashboard</h1>
          </div>
          <div className="ml-auto">
            <Button
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              variant="ghost"
              size="sm"
              className="text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {isLoggingOut ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <LogOutIcon className="w-4 h-4" />
              )}
              <span className="ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Always use centered dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
      
      {/* Logout Loading Screen removed; handled at page level */}
    </>
  )
}
