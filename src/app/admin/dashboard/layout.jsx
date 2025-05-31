"use client";

import Link from "next/link";
import { usePathname, useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Posts", href: "/admin/dashboard/posts" },
  { label: "Notifications", href: "/admin/dashboard/notifications" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted

  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted after the first render
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout", {}, { withCredentials: true });
      localStorage.removeItem("token"); // Remove the token from localStorage
      router.push("/admin/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Only render the layout after the component has mounted
  if (!isMounted) {
    return null; // Optionally return null until mounted to avoid any rendering issues
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-100 p-6 flex flex-col space-y-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        {navItems.map(({ label, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`block p-3 rounded cursor-pointer hover:bg-gray-200 ${
                active ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
        <p
          onClick={handleLogout}
          className="block p-3 rounded cursor-pointer hover:bg-gray-200"
        >
          Logout
        </p>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}