'use client';

import { Suspense, useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"
import MobileBottomNav from "@/components/ui/mobile-bottom-nav"
import { useDashboardLoading } from "@/hooks/use-app-initialization"
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
// Removed PixelBlast to prevent hydration issues

import data from "./data.json"

export default function Page() {
  const { isLoading, error, retry } = useDashboardLoading();
  const { isLoggingOut } = useUser();
  const router = useRouter();
  // Removed initial mount skeletons in favor of full-screen loader
  const [viewportWidth, setViewportWidth] = useState<number | null>(null);

  // Client-side guard to backstop server/middleware redirects
  useEffect(() => {
    let aborted = false;
    const check = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        const data = await res.json();
        if (!aborted && (!data || !data.user)) {
          router.replace('/');
        }
      } catch {
        if (!aborted) router.replace('/');
      }
    };
    check();
    return () => { aborted = true; };
  }, [router]);

  // Disable initial page skeletons; we rely on the full-screen loader instead

  // Lock main content width in pixels to prevent layout shifts when scroll-lock toggles
  useEffect(() => {
    const update = () => {
      if (typeof document !== 'undefined') {
        const w = document.documentElement.clientWidth;
        setViewportWidth(w);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // During logout, unmount dashboard content entirely. Global overlay will handle visuals.
  if (isLoggingOut) {
    return null;
  }

  if (isLoading) {
    return (
      <FullScreenLoading
        isVisible={true}
      />
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-neutral-400 mb-6">{error}</p>
          <button
            onClick={retry}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen bg-black overflow-x-hidden"
      style={{ width: viewportWidth ? `${viewportWidth}px` : undefined }}
    >
      {/* Simple background gradient instead of PixelBlast */}
      <div className="fixed inset-0 w-full h-full z-0 bg-gradient-to-br from-green-900/20 to-green-600/10" />
      
      {/* Mobile-optimized backdrop - same as landing page */}
      <div className="fixed inset-0 bg-black/70 sm:bg-black/10 backdrop-blur-[2px] z-10"></div>
      
      {/* Dashboard Content */}
      <div className="relative z-20">
        <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset className="max-w-none w-full" style={{ scrollbarGutter: 'stable' }}>
            <SiteHeader />
            <div id="dashboard-top" className="flex flex-1 flex-col overflow-hidden pt-14 md:pt-0">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 pb-24">
                  <div className="fade-in-0 animate-fade-slide-up">
                  <Suspense 
                    fallback={
                      <div className="grid grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4 px-4 lg:px-6">
                        {Array.from({ length: 4 }, (_, i) => (
                          <CardSkeleton key={i} />
                        ))}
                      </div>
                    }
                  >
                    <div id="dashboard-cards">
                      <SectionCards />
                    </div>
                  </Suspense>
                  
                  <div id="dashboard-chart" className="px-4 lg:px-6 mt-4 md:mt-6 mb-4 md:mb-6 scroll-mt-16 md:scroll-mt-0">
                    <Suspense fallback={<ChartSkeleton />}>
                      <ChartAreaInteractive />
                    </Suspense>
                  </div>
                  
                  <div id="dashboard-table" className="mt-4 md:mt-6 scroll-mt-16 md:scroll-mt-0">
                    <Suspense fallback={<TableSkeleton rows={10} />}>
                      <DataTable data={data} />
                    </Suspense>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            <MobileBottomNav />
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Logout overlay removed; dashboard unmounts during logout */}
    </div>
  )
}
