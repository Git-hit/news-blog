"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "../../../../../../components/posts/postForm";
import axios from "axios";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    async function fetchPost() {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      const res = await axios.get(`http://localhost:8000/api/posts/${id}`);
      setPost(res.data.post);
    }
    fetchPost();
  }, [id]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      {post ? (
        <PostForm initialData={post} isEdit={true} postId={id} />
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
}