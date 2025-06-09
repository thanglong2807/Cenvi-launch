"use client";

import { useSidebar } from "@/context/SidebarContext";

import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import useAuthInit from '@/hooks/useAuthInit';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthInit();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex bg-[#fff]">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        {/* Page Content */}
        <div className="mx-auto">{children}</div>
      </div>
      
    </div>
    
  );
}
