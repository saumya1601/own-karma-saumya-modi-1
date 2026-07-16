import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-900/10 rounded-3xl border border-slate-900/40">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of platform activities and stats</p>
      </div>
    </div>
  );
}
