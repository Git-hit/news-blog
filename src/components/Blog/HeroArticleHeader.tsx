"use client";
import './blogStyles.css';

interface BlogPageProps {
  title?: string;
  content?: string;
  image?: string;
}

export default function BlogPage({ title = 'Untitled', content = '', image = "" }: BlogPageProps) {

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <img src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`} />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}