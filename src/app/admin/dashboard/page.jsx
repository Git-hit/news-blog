"use client";

import { useEffect } from "react";

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Dashboard"
  }, []);
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Welcome to Admin Dashboard</h1>
      <p>This is the dashboard homepage.</p>
    </>
  );
}