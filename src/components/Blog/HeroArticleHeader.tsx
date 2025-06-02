"use client";
import './blogStyles.css';
import { decode } from "he";

interface BlogPageProps {
  title?: string;
  content?: string;
}

export default function BlogPage({ title = 'Untitled', content = '' }: BlogPageProps) {

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}