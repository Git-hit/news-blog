import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";
import NewsFooter from "@/src/components/Footer/Footer";
import PostViewCounter from "@/src/components/posts/viewCountUpdater";
import BlogPage from "@/src/components/Blog/BlogPage";
import { decode } from "he";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  const res = await fetch(`${API}/api/pages/slug/${params.slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return {};

  const { page } = await res.json();

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description,
      // Uncomment if og_image is reliable:
      // images: page.og_image ? [`${API}/storage/${page.og_image}`] : [],
    },
    robots: page.robots_tag,
    alternates: {
      canonical: page.canonical_url,
    },
  };
}

export default async function Page({ params }) {
  const [pageRes, newsRes, menuRes] = await Promise.all([
    fetch(`${API}/api/pages/slug/${params.slug}`, { cache: "no-store" }),
    fetch(`${API}/api/news`, { next: { revalidate: 60 } }),
    fetch(`${API}/api/menu`, { next: { revalidate: 300 } }),
  ]);

  if (!pageRes.ok) return notFound();

  const [{ page }, news, menu] = await Promise.all([
    pageRes.json(),
    newsRes.json(),
    menuRes.json(),
  ]);

  const cleanContent = page.content
    .replace(/<p><\/p>/g, "<p><br /></p>")
    .replace(
      /<div[^>]+data-html-snippet[^>]+content="([^"]+)"[^>]*><\/div>/g,
      (_, encoded) => decode(encoded)
    );

  return (
    <div>
      <Navbar posts={news} menu={menu} />
      <PostViewCounter slug={params.slug} type="pages" />
      <BlogPage title={page.title} content={cleanContent} image={page.image} isPost={false} />
      <NewsFooter />
    </div>
  );
}