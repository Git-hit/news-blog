"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"; // Adjust path as needed

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import {
  GalleryVertical,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  StickyNote,
  User,
  Users,
} from "lucide-react";

const allNavItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    key: "dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Posts",
    url: "/admin/dashboard/posts",
    key: "posts",
    icon: StickyNote,
  },
  {
    title: "Pages",
    url: "/admin/dashboard/pages",
    key: "pages",
    icon: StickyNote,
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/notifications",
    key: "notifications",
    icon: Megaphone,
  },
  {
    title: "Header Settings",
    url: "/admin/dashboard/header",
    key: "header",
    icon: GalleryVertical,
  },
  {
    title: "Footer Settings",
    url: "/admin/dashboard/footer",
    key: "footer",
    icon: GalleryVertical,
  },
  { title: "Users", 
    url: "/admin/dashboard/users", 
    key: "users", 
    icon: Users 
  },
  {
    title: "Settings",
    url: "/admin/dashboard/settings",
    key: "settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem("role");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

    let allowed = ["dashboard"];

    if (role === "admin") {
      allowed = allNavItems.map((item) => item.key);
    } else if (role === "user") {
      if (
        permissions.includes("create_edit_post") ||
        permissions.includes("view_posts_only")
      ) {
        allowed.push("posts");
      }
      if (permissions.includes("manage_footer_settings")) {
        allowed.push("footer");
      }
      if (permissions.includes("manage_notifications")) {
        allowed.push("notifications");
      }
    }

    setFilteredItems(allNavItems.filter((item) => allowed.includes(item.key)));
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {});
      localStorage.clear();
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!isMounted) return null;

  const renderSidebar = () => (
    <Sidebar className="w-64 flex flex-col border-r bg-gray-100">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const active =
                  pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.key} active={active}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Dropdown for account actions */}
      <div className="p-4 border-t mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {loggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-white text-gray-900">
        {/* Desktop Sidebar */}
        {renderSidebar()}

        {/* Mobile Sidebar */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <ScrollArea className="h-full w-full p-4">
                {renderSidebar()}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-5">
          {children}
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}