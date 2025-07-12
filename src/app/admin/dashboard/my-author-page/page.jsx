"use client";

import { useState, useEffect } from "react";
import PostEditor from "@/src/components/posts/postEditor";
import axios from "axios";

export default function MyAuthorPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const allowed = localStorage.getItem("role") !== "admin";

  useEffect(() => {
    async function getAuthorPageDetails() {
      try {
        const page = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/author-pages/my-author-page/${localStorage.getItem("email")}`
        );
        const pageData = page.data;
        setTitle(pageData.title || "");
        setSlug(pageData.slug || "");
        setContent(pageData.content || "");
      } catch (error) {
        console.log(error);
      }
    }
    getAuthorPageDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!slug.trim()) {
      setMessage("❌ Slug is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/author-pages/my-author-page`,
        {
          data: { title, content, slug },
          email: localStorage.getItem("email"),
        }
      );

      if (res.ok || res.status === 200) {
        setMessage("✅ Author page created successfully!");
      } else {
        setMessage(res.message || "❌ Failed to create page.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed) {
    return <div className="text-center text-red-600 mt-10">Access Denied</div>;
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Author Page</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex">
          {/* Post Editor */}
          <div className="border rounded p-2 min-h-[200px]">
            <PostEditor
              key={content}
              title={title}
              onTitleChange={(e) => setTitle(e)}
              content={content}
              onChange={setContent}
            />
          </div>
          {/* Permalink Slug */}
          <div className="ps-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Permalink
            </label>
            <div className="flex border rounded overflow-hidden">
              <span className="bg-gray-100 text-gray-600 px-3 py-2 text-sm flex items-center">
                {process.env.NEXT_PUBLIC_API_URL}/authors/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, "-")
                  )
                }
                className="flex-1 px-3 py-2 text-sm border-none focus:outline-none"
                placeholder="your-custom-slug"
                required
              />
            </div>
          </div>
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {loading ? "Submitting..." : "Create Page"}
        </button>
        {message && (
          <div className="text-center text-sm text-green-700 mt-2">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}