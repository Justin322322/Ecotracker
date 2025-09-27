"use client"

import * as React from "react"
import {
  BarChart3Icon,
  CameraIcon,
  CarIcon,
  ClipboardListIcon,
  DatabaseIcon,
  LeafIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  TrendingDownIcon,
  ZapIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUser } from "@/contexts/UserContext"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Transportation",
      url: "/dashboard/transportation",
      icon: CarIcon,
    },
    {
      title: "Energy Usage",
      url: "/dashboard/energy",
      icon: ZapIcon,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3Icon,
    },
    {
      title: "Reduction Goals",
      url: "/dashboard/goals",
      icon: TrendingDownIcon,
    },
  ],
  navActivities: [
    {
      title: "Track Activity",
      icon: CameraIcon,
      isActive: true,
      url: "/dashboard/track",
      items: [
        {
          title: "Daily Commute",
          url: "/dashboard/track/commute",
        },
        {
          title: "Home Energy",
          url: "/dashboard/track/energy",
        },
        {
          title: "Travel",
          url: "/dashboard/track/travel",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ],
  reports: [
    {
      name: "Carbon Reports",
      url: "/dashboard/reports",
      icon: ClipboardListIcon,
    },
    {
      name: "Data Export",
      url: "/dashboard/export",
      icon: DatabaseIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  // Create user data for NavUser component
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: "/avatars/user.jpg", // You can update this to use user.avatar if available
  } : {
    name: "Guest User",
    email: "guest@ecotracker.com",
    avatar: "/avatars/guest.jpg",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <LeafIcon className="h-5 w-5 text-green-500" />
                <span className="text-base font-semibold">EcoTracker</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.reports} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
