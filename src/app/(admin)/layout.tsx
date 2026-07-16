"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Helper to determine active state of menu items
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex-1 flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Ambient background glows for the admin space */}
      <div className="absolute top-[10%] right-[-10%] w-[40%] aspect-square rounded-full bg-emerald-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[35%] aspect-square rounded-full bg-slate-900/40 blur-[100px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/80 transition-transform duration-300 transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col justify-between py-6">
          <div className="space-y-6">
            {/* Header branding */}
            <div className="px-6 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/10 transition-transform duration-200 group-hover:scale-105">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Karma Admin
                </span>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu Links */}
            <nav className="px-3 space-y-1">
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                Overview
              </Link>

              <Link
                href="/admin/karma-logs"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/admin/karma-logs")
                    ? "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Karma Logs
              </Link>

              <Link
                href="/admin/settings"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/admin/settings")
                    ? "bg-emerald-500/10 border-l-2 border-emerald-500 text-emerald-300 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </nav>
          </div>

          {/* Footer exit link */}
          <div className="px-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Exit to Main Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile toggle overlay */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-4 left-4 z-50 lg:hidden p-3.5 rounded-full bg-emerald-500 text-slate-950 shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:scale-105 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Breadcrumb status */}
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">
              {isActive("/admin")
                ? "Overview"
                : isActive("/admin/karma-logs")
                ? "Karma Logs"
                : "Settings"}
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Notifications Button */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              type="button"
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* Notification Menu */}
            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-sm">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="font-bold text-white">Ripples & Notifications</span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">1 New</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/40">
                    <p className="text-xs text-slate-300 leading-normal">
                      🎉 Your karma streak reached <strong className="text-emerald-400">7 days</strong>! Keep up the mindful action.
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">2 hours ago</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/20 text-slate-400">
                    <p className="text-xs leading-normal">
                      System auto-updated your daily affirmations database.
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">Yesterday</span>
                  </div>
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-900">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-white">Saumya S.</div>
                <div className="text-[10px] text-slate-500">Karma Owner</div>
              </div>
              <div className="relative w-8.5 h-8.5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                SS
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
