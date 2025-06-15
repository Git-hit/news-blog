"use client";
import "./blogStyles.css";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { DateTime } from "luxon";
import Link from "next/link";

export default function BlogPage({
  title = "Untitled",
  content = "",
  image = "",
  slug = "",
  allComments = "",
  allPosts = [],
  isPost = true,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    postSlug: slug,
  });
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState(allComments || []);
  const [mostPopular, setMostPopular] = useState(allPosts || []);

  // console.log(allComments)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newComment = {
        name: formData.name,
        email: formData.email,
        postSlug: formData.postSlug,
        comment: formData.comment,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // console.log(newComment);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/send-comment`,
        newComment
      );


      // setComments((prev) => [newComment, ...prev]);

      toast("Your comment was submitted for review.");
      setFormData({ name: "", email: "", comment: "", postSlug: slug });
    } catch (error) {
      toast("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex md:gap-7">
        <div className={`${isPost ? "md:w-2/3" : "w-full"}`}>
          {image && (
            <img src={`${image}`} />
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
              <Button className="cursor-pointer" type="submit" disabled={submitting}>
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
                    key={comment._id}
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
        {/* RIGHT SIDEBAR: Most Popular */}
        <div className="hidden md:block w-1/3">
          <div className="sticky top-24">
            <div className="bg-white p-4">
              <h2 className="text-center text-red-700 mb-5">MOST POPULAR</h2>
              {mostPopular.map((post, index) => (
                <Link
                  key={index}
                  href={`/post/${post.slug}`}
                  className="flex gap-3 items-start cursor-pointer w-full mb-4"
                >
                  <img className="w-1/3 object-cover" src={post.image} alt={post.title} />
                  <p className="w-2/3 text-sm font-medium">{post.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}