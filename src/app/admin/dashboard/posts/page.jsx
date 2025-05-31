"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    document.title = "All Post";
  }, []);

  const fetchPosts = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
      setPosts(res.data); // Adjust based on your API response
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link
          href="/admin/dashboard/posts/new"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white"
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="border-2 border-b-transparent border-slate-900 rounded-full size-10 animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <table className="w-full text-left border-collapse border overflow-y-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Views</th>
              <th className="p-2 border">Featured</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{post.title}</td>
                <td className="p-2 border">{post.slug}</td>
                <td className="p-2 border">{post.views ?? 0}</td>
                <td className="p-2 border">
                  {post.featured === 1 ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
                <td className="p-2 border space-x-2">
                  <Link
                    target="_blank"
                    href={`/post/${post.slug}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/dashboard/posts/edit/${post.id}`}
                    className="text-yellow-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}