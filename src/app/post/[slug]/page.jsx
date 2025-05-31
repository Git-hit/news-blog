import { notFound } from "next/navigation";
// import Layout from "./layout";
import Navbar from "../../../components/Navbar/Navbar";
import NewsFooter from "../../../components/Footer/Footer";
import TopIndex from "../../../components/Blog/TopIndex";
import Upnext from "../../../components/Blog/Upnext";
import MostRead from "../../../components/news/MostRead";
import TariffNews from "../../../components/Blog/TariffNews";
import BlogPage from "../../../components/Blog/HeroArticleHeader";
import PostViewCounter from "../../../components/posts/postViewCounter";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  // Await params
  const awaitedParams = await params;

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`, {
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
      images: post.og_image ? [`${NEXT_PUBLIC_API_URL}/storage/${post.og_image}`] : [],
    },
    robots: post.robots_tag,
    alternates: {
      canonical: post.canonical_url,
    },
  };
}

export default async function Post({ params }) {
  const awaitedParams = await params;

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const { post } = await res.json();

  const postData = {
    title: post.title,
    content: post.content,
    image: post.image,
    category: post.category, // add what's needed
  };

  let loading = true;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
    cache: "no-store",
  });
  const news = await response.json();
  loading = false;

  return (
    <>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <div>
          <Navbar posts={news} />
          {/* <TopIndex /> */}
          <PostViewCounter slug={awaitedParams.slug} />
          <BlogPage
            title={postData.title}
            content={postData.content}
            image={postData.image}
          />
          <Upnext posts={news} category={awaitedParams.slug} />
          {/* <MostRead mostReadData={postData} category={} /> */}
          {/* <TariffNews /> */}
          <NewsFooter />
        </div>
      )}
    </>
  );
}