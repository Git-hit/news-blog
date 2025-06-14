import { notFound } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";
import NewsFooter from "@/src/components/Footer/Footer";
import Upnext from "@/src/components/Blog/Upnext";
import BlogPage from "@/src/components/Blog/BlogPage";
import PostViewCounter from "@/src/components/posts/viewCountUpdater";
import { decode } from "he";
import TwitterScriptLoader from "../../../components/posts/twitterScriptLoader";

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${params.slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return {};

  const { post } = await res.json();

  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description,
      images: post.og_image ? [post.og_image] : [],
    },
    robots: post.robots_tag,
    alternates: {
      canonical: post.canonical_url,
    },
  };
}

export default async function Post({ params }) {
  const slug = params.slug;

  const [postRes, newsRes, menuRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${slug}`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
      next: { revalidate: 60 },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!postRes.ok) return notFound();

  const [{ post, comments, allPosts }, news, menu] = await Promise.all([
    postRes.json(),
    newsRes.json(),
    menuRes.json(),
  ]);

  const cleanContent = post.content
    .replace(/<p><\/p>/g, "<p><br /></p>")
    .replace(/<div[^>]+data-html-snippet[^>]+content="([^"]+)"[^>]*><\/div>/g, (_, encoded) => {
      const decoded = decode(encoded);
      const sanitized = decoded
        .replace(/width="[^"]*"/g, `width="100%"`)
        .replace(/height="[^"]*"/g, `style="min-height:400px"`);
      return `
        <div style="max-width: 100%; overflow: hidden;">
          <div style="position: relative; width: 100%; height: auto;">
            ${sanitized}
          </div>
        </div>`;
    });

  return (
    <div>
      <Navbar posts={news} menu={menu} />
      <PostViewCounter slug={slug} type="posts" />
      <BlogPage
        title={post.title}
        content={cleanContent}
        image={post.image}
        slug={slug}
        allComments={comments}
        allPosts={allPosts}
      />
      <Upnext posts={news} category={slug} />
      <NewsFooter />
      {/* Move Twitter widget loading to client side if not needed at SSR */}
      {/* <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" /> */}
      <TwitterScriptLoader />
    </div>
  );
}