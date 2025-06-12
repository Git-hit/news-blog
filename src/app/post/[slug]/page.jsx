import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar/Navbar";
import NewsFooter from "../../../components/Footer/Footer";
import Upnext from "../../../components/Blog/Upnext";
import BlogPage from "../../../components/Blog/BlogPage";
import PostViewCounter from "../../../components/posts/viewCountUpdater";
import { decode } from "he";

export async function generateMetadata({ params }) {
  const awaitedParams = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`,
    {
      next: { revalidate: 60 },
    }
  );

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

  const [postRes, newsRes, menuRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/posts/slug/${awaitedParams.slug}`,
      { cache: "no-store" }
    ),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu`, { cache: "no-store" }),
  ]);

  if (!postRes.ok) return notFound();

  const [{ post, comments, allPosts }, news, menu] = await Promise.all([
    postRes.json(),
    newsRes.json(),
    menuRes.json(),
  ]);

  const postData = {
    title: post.title,
    content: post.content,
    image: post.image,
    category: post.category,
    comments,
    allPosts,
  };

  const processedHtml = postData.content.replace(/<p><\/p>/g, "<p><br /></p>");

  const withDecodedSnippets = processedHtml.replace(
    /<div[^>]+data-html-snippet[^>]+content="([^"]+)"[^>]*><\/div>/g,
    (_, encodedContent) => {
      const decoded = decode(encodedContent);
      return `
      <div style="max-width: 100%; overflow: hidden;">
        <div style="position: relative; width: 100% height: auto;">
          ${decoded
            .replace(/width="[^"]*"/g, "width=100%")
            .replace(/height="[^"]*"/g, `style="min-height:400px"`)}
        </div>
      </div>
    `;
    }
  );

  return (
    <div>
      <Navbar posts={news} menu={menu} />
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
      <NewsFooter />
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        charSet="utf-8"
      ></script>
    </div>
  );
}