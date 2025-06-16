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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Default limit
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
      localStorage.getItem("role") === "admin" ||
      localPerms.includes("create_edit_post") ||
      localPerms.includes("view_posts_only");

    setPermissions(localPerms);
    setHasPermission(allowed);

    if (allowed) {
      fetchPosts();
    }

    document.title = "All Post";
  }, [page]);

  useEffect(() => {
    if (hasPermission) {
      fetchPosts();
    }
  }, [page, limit]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=${limit}&page=${page}&only_metadata=true`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${deleteId}`);
      setPosts(posts.filter((post) => post._id !== deleteId));
      toast({ title: "Post deleted successfully." });
    } catch (err) {
      console.error("Delete failed", err);
      toast("Failed to delete the post");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

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
        <h1 className="text-3xl font-bold tracking-tight">📄 All Posts</h1>
        {(permissions.includes("create_edit_post") || localStorage.getItem("role") === "admin") && (
          <Link href="/admin/dashboard/posts/new">
            <Button className="text-sm cursor-pointer">+ New Post</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg">No posts yet.</div>
      ) : (
        <>
          <Card className="shadow-md rounded-lg border">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post, index) => (
                    <TableRow key={post._id} className="hover:bg-gray-50 transition">
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.views ?? 0}</TableCell>
                      <TableCell>
                        {post.featured === 1 ? (
                          <span className="text-green-600 font-semibold">Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </TableCell>
                      <TableCell className="space-x-3 whitespace-nowrap">
                        {permissions.includes("view_posts_only") &&
                          !permissions.includes("create_edit_post") ? (
                          <Link
                            target="_blank"
                            href={`/post/${post.slug}`}
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                          >
                            View Live
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/admin/dashboard/posts/edit/${post._id}`}
                              className="text-yellow-600 hover:underline text-sm cursor-pointer"
                            >
                              Edit
                            </Link>
                            <Link
                              target="_blank"
                              href={`/post/${post.slug}`}
                              className="text-blue-600 hover:underline text-sm cursor-pointer"
                            >
                              View
                            </Link>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => setDeleteId(post._id)}
                                  className="text-red-600 hover:underline text-sm cursor-pointer"
                                >
                                  Delete
                                </button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm text-muted-foreground mb-4">
                                  This action cannot be undone. The post will be permanently deleted.
                                </p>
                                <DialogFooter>
                                  <Button
                                    className="cursor-pointer"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                  >
                                    {deleting ? "Deleting..." : "Confirm"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(parseInt(value));
                  setPage(1); // reset to page 1 when limit changes
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 25, 50, 100, 500].map((val) => (
                    <SelectItem key={val} value={String(val)}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Existing Pagination Buttons */}
            <div className="flex items-center gap-2">
              <Button className="cursor-pointer" variant="outline" onClick={handlePrev} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button className="cursor-pointer" variant="outline" onClick={handleNext} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}