"use client";
import "./blogStyles.css";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";

export default function BlogPage({
  title = "Untitled",
  content = "",
  image = "",
  slug = "",
  allComments = "",
  allPosts = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    "post-slug": slug,
  });
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState(allComments || []);
  const [mostPopular, setMostPopular] = useState(allPosts || []);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/send-comment`,
        formData
      );

      const newComment = {
        id: Date.now(),
        name: formData.name,
        comment: formData.comment,
        created_at: new Date().toISOString(),
      };

      setComments((prev) => [newComment, ...prev]);

      toast("Your comment was submitted.");
      setFormData({ name: "", email: "", comment: "", "post-slug": slug });
    } catch (error) {
      toast("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex gap-7 min-h-screen">
        <div className="w-2/3">
          {image && (
            <img src={`/uploads/${image}`} />
          )}
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Comment Form */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="comment"
                placeholder="Your Comment"
                value={formData.comment}
                onChange={handleChange}
                required
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <div className="flex h-screen justify-center items-center">
                    <div className="animate-spin border-2 border-white border-b-transparent rounded-full size-7"></div>
                  </div>
                ) : (
                  "Comment"
                )}
              </Button>
            </form>
          </section>

          {/* Display Comments */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            {comments.length > 0 ? (
              <ul className="space-y-6">
                {comments.map((comment) => (
                  <li
                    key={comment.id}
                    className="p-4 border rounded-xl shadow-sm flex items-start gap-4"
                  >
                    <img
                      src={`https://avatar.iran.liara.run/public`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-semibold text-base text-gray-900">
                          {comment.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {DateTime.fromISO(comment.created_at).toFormat(
                            "DD h:m a"
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                        {comment.comment}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No comments yet.</p>
            )}
          </section>
        </div>
        <div className="min-h-screen w-1/3">
          <div className="hidden md:block md:sticky top-0">
            {mostPopular && (
              <h2 className="text-center text-red-700 mb-5">MOST POPULAR</h2>
            )}
            {mostPopular &&
              mostPopular.map((post, index) => (
                <div
                  key={index}
                  onClick={() => router.push(`/post/${post.slug}`)}
                  className="flex gap-3 items-start cursor-pointer w-full"
                >
                  <img className="w-1/3" src={`/uploads/${post.image}`} alt={post.title} />
                  <p className="w-2/3">{post.title}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}