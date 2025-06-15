"use client";
import './blogStyles.css';

export default function HeroArticleHeader({ title = 'Untitled', content = '', image = "" }) {

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <img src={`${image}`} />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  );
}