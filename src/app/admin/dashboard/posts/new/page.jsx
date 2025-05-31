"use client";

import PostForm from "../../../../../components/posts/postForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm isEdit={false} />
    </div>
  );
}