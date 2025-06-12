"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "../../../../../../components/posts/postForm";
import axios from "axios";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [allowed, setAllowed] = useState();

  useEffect(() => {
    document.title = "Edit Post";
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    async function fetchPost() {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
      setPost(res.data.post);
    }
    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed = localStorage.getItem("role") === "admin" || localPerms.includes("create_edit_post")
    setAllowed(allowed);
    if (allowed) fetchPost();
  }, [id]);

  if(!allowed){
    return(
        <p className="text-red-500">You don’t have permission to view this page.</p>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      {post ? (
        <PostForm initialData={post} isEdit={true} postId={id} />
      ) : (
        <p>Loading post...</p>
      )}
      <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
    </div>
  );
}