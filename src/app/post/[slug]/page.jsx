import { notFound } from "next/navigation";
// import Layout from "./layout";
import Navbar from "../../../components/Navbar/Navbar";
import NewsFooter from "../../../components/Footer/Footer";
import TopIndex from "../../../components/Blog/TopIndex";
import Upnext from "../../../components/Blog/Upnext";
import MostRead from "../../../components/news/MostRead";
import TariffNews from "../../../components/Blog/TariffNews";
import BlogPage from "../../../components/Blog/BlogPage";
import PostViewCounter from "../../../components/posts/viewCountUpdater";
import { decode } from "he";

// const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  // Await params
  const awaitedParams = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return {};

  const { post } = await res.json();

  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description,
      images: post.og_image ? [`/uploads/${post.og_image}`] : [],
    },
    robots: post.robots_tag,
    alternates: {
      canonical: post.canonical_url,
    },
  };
}

export default async function Post({ params }) {
  const awaitedParams = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const { post, comments, allPosts } = await res.json();

  const postData = {
    title: post.title,
    content: post.content,
    image: post.image,
    category: post.category,
    comments,
    allPosts,
  };

  const processedHtml = postData.content.replace(/<p><\/p>/g, '<p><br /></p>');

  const withDecodedSnippets = processedHtml.replace(
  /<div[^>]+data-html-snippet[^>]+content="([^"]+)"[^>]*><\/div>/g,
  (_, encodedContent) => {
    const decoded = decode(encodedContent);
    return `
      <div style="max-width: 100%; overflow: hidden;">
        <div style="position: relative; width: 100% height: auto;">
          ${decoded.replace(/width="[^"]*"/g, 'width=100%').replace(/height="[^"]*"/g, `style="min-height:400px"`)}
        </div>
      </div>
    `;
  }
);

  let loading = true;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
    cache: "no-store",
  });
  const news = await response.json();
  const menuRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, {
    cache: "no-store",
  });
  const menu = await menuRes.json();
  loading = false;

  return (
    <>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <div>
          <Navbar posts={news} menu={menu} />
          {/* <TopIndex /> */}
          <PostViewCounter slug={awaitedParams.slug} type={"posts"} />
          <BlogPage
            title={postData.title}
            content={withDecodedSnippets}
            image={postData.image}
            slug={awaitedParams.slug}
            allComments={postData.comments}
            allPosts={postData.allPosts}
          />
          <Upnext posts={news} category={awaitedParams.slug} />
          {/* <MostRead mostReadData={postData} category={} /> */}
          {/* <TariffNews /> */}
          <NewsFooter />
          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </div>
      )}
    </>
  );
}