"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  image: string;
  created_at: string;
  category: string;
  read_time: string;
}

interface UpnextProps {
  posts: Post[];
  category: string;
}

const Upnext: React.FC<UpnextProps> = ({ posts, category }) => {
  const router = useRouter();

  const filteredPosts = posts
    .filter((post) => post.category === category)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const fallbackPosts = posts
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  const upNextPosts =
    filteredPosts.length >= 4 ? filteredPosts.slice(0, 4) : fallbackPosts;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Up next</h2>

      <ul className="space-y-6">
        {upNextPosts.map((post, index) => (
          <li
            onClick={() => {
              const currentSlug = window.location.pathname.split("/").pop();
              if (currentSlug === post.slug) {
                // Navigate to the same slug: force reload
                // router.replace(`/post/${post.slug}`); // Soft navigation
                window.location.reload(); // Full reload to fetch new data
              } else {
                router.push(`/post/${post.slug}`);
              }
            }}
            key={post.id}
            className={`flex justify-between gap-4 pb-4 ${
              index !== upNextPosts.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex-1">
              <h3 className="text-base font-medium text-black hover:underline cursor-pointer">
                {post.title}
              </h3>
              {/* <p className="text-sm text-gray-600 mt-1">
                {post.read_time || "4 min read"}
              </p> */}
            </div>
            <div className="w-28 h-20 flex-shrink-0">
              <Image
                src={`${process.env.API_URL}/storage/${post.image}`}
                alt={post.title}
                width={112}
                height={80}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Upnext;