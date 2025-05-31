"use client";

import { useEffect } from "react";
import PostForm from "../../../../../components/posts/postForm";

export default function NewPostPage() {
  useEffect(() => {
    document.title = "Create Post";
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm isEdit={false} />
    </div>
  );
}