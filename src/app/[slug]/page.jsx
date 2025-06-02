import { notFound } from "next/navigation";
// import Layout from "./layout";
import Navbar from "../../components/Navbar/Navbar";
import NewsFooter from "../../components/Footer/Footer";
import TopIndex from "../../components/Blog/TopIndex";
import Upnext from "../../components/Blog/Upnext";
import MostRead from "../../components/news/MostRead";
import TariffNews from "../../components/Blog/TariffNews";
import BlogPage from "../../components/Blog/HeroArticleHeader";
import PostViewCounter from "../../components/posts/postViewCounter";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateMetadata({ params }) {
  // Await params
  const awaitedParams = await params;

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/pages/slug/${awaitedParams.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return {};

  const { page } = await res.json();

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    openGraph: {
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description,
    //   images: page.og_image ? [`${NEXT_PUBLIC_API_URL}/storage/${page.og_image}`] : [],
    },
    robots: page.robots_tag,
    alternates: {
      canonical: page.canonical_url,
    },
  };
}

export default async function Page({ params }) {
  const awaitedParams = await params;

  const res = await fetch(`${NEXT_PUBLIC_API_URL}/api/pages/slug/${awaitedParams.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const { page } = await res.json();

  const pageData = {
    title: page.title,
    content: page.content,
    image: page.image,
    category: page.category, // add what's needed
  };

  const processedHtml = content.replace(/<p><\/p>/g, '<p><br /></p>');
  
    const withDecodedSnippets = processedHtml.replace(
      /<div[^>]+data-html-snippet[^>]+content="([^"]+)"[^>]*><\/div>/g,
      (_, encodedContent) => decode(encodedContent)
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
          <PostViewCounter slug={awaitedParams.slug} type={"pages"} />
          <BlogPage
            title={pageData.title}
            content={withDecodedSnippets}
            image={pageData.image}
          />
          {/* <Upnext posts={news} category={awaitedParams.slug} /> */}
          {/* <MostRead mostReadData={pageData} category={} /> */}
          {/* <TariffNews /> */}
          <NewsFooter />
        </div>
      )}
    </>
  );
}