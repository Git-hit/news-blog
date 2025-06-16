"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AllPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState("user");
  const [hasPermission, setHasPermission] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
      localStorage.getItem("role") === "admin" ||
      localPerms.includes("create_edit_page") ||
      localPerms.includes("view_pages_only");
    setPermissions(localPerms);
    setHasPermission(allowed);

    if (allowed) {
      fetchPages();
    }

    document.title = "All Pages";
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pages`
      );
      setPages(res.data);
    } catch (err) {
      console.error("Failed to fetch pages", err);
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async () => {
    if (!deletingId) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pages/${deletingId}`
      );
      setPages(pages.filter((page) => page._id !== deletingId));
      toast("Page deleted successfully.");
    } catch (err) {
      toast("Failed to delete page");
    } finally {
      setDeletingId(null);
      setOpenDialog(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg font-medium">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">📄 All Pages</h1>
        {(permissions.includes("create_edit_page") || role === "admin") && (
            <Link href="/admin/dashboard/pages/new">
              <Button className="text-sm cursor-pointer">+ New Page</Button>
            </Link>
          )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">
          No pages yet.
        </div>
      ) : (
        <Card className="shadow-md rounded-lg border">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-sm font-semibold text-gray-600">
                    #
                  </TableHead>
                  <TableHead className="text-sm font-semibold text-gray-600">
                    Title
                  </TableHead>
                  {/* <TableHead className="text-sm font-semibold text-gray-600">
                    Slug
                  </TableHead> */}
                  <TableHead className="text-sm font-semibold text-gray-600">
                    Views
                  </TableHead>
                  <TableHead className="text-sm font-semibold text-gray-600">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page, index) => (
                  <TableRow
                    key={page.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    {/* <TableCell>{page.slug}</TableCell> */}
                    <TableCell>{page.views ?? 0}</TableCell>
                    <TableCell className="space-x-3 whitespace-nowrap">
                      {permissions.includes("view_pages_only") &&
                      role !== "admin" &&
                      !permissions.includes("create_edit_page") ? (
                        <Link
                          target="_blank"
                          href={`/${page.slug}`}
                          className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                          View Live
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={`/admin/dashboard/pages/edit/${page._id}`}
                            className="text-yellow-600 hover:underline text-sm cursor-pointer"
                          >
                            Edit
                          </Link>
                          <Link
                            target="_blank"
                            href={`/${page.slug}`}
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                          >
                            View
                          </Link>
                          {/* <button
                            onClick={() => handleDelete(page.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button> */}
                          <button
                            onClick={() => {
                              setDeletingId(page._id);
                              setOpenDialog(true);
                            }}
                            className="text-red-600 hover:underline text-sm cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            This action cannot be undone. Do you really want to delete this
            page?
          </p>
          <DialogFooter>
            <Button className="cursor-pointer" variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button className="cursor-pointer" variant="destructive" onClick={deletePage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}