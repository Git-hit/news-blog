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
import { toast } from "sonner";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
      localStorage.getItem("role") === "admin" || localPerms.includes("create_edit_post") || localPerms.includes("view_posts_only");
    setPermissions(localPerms);
    setHasPermission(allowed);

    if (allowed) {
      fetchPosts();
    }

    document.title = "All Post";
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
      setPosts(res.data);
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
      setPosts(posts.filter((post) => post.id !== deleteId));
      toast({ title: "Post deleted successfully." });
    } catch (err) {
      console.error("Delete failed", err);
      toast({
        title: "Error",
        description: "Failed to delete the post.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteId(null);
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
        <h1 className="text-3xl font-bold tracking-tight">📄 All Posts</h1>
        {(permissions.includes("create_edit_post") || localStorage.getItem("role") === "admin") && (
          <Link href="/admin/dashboard/posts/new">
            <Button className="text-sm">+ New Post</Button>
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
        <Card className="shadow-md rounded-lg border">
          <div className="overflow-x-auto w-full">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  {/* <TableHead>Slug</TableHead> */}
                  <TableHead>Views</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={post.id} className="hover:bg-gray-50 transition">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    {/* <TableCell>{post.slug}</TableCell> */}
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
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Live
                        </Link>
                      ) : (
                        <>
                          <Link
                            href={`/admin/dashboard/posts/edit/${post.id}`}
                            className="text-yellow-600 hover:underline text-sm"
                          >
                            Edit
                          </Link>
                          <Link
                            target="_blank"
                            href={`/post/${post.slug}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View
                          </Link>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                onClick={() => setDeleteId(post.id)}
                                className="text-red-600 hover:underline text-sm"
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
                                {/* <Button
                                  variant="secondary"
                                  onClick={() => setDeleteId(null)}
                                >
                                  Cancel
                                </Button> */}
                                <Button
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
      )}
    </div>
  );
}