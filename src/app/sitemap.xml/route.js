import axios from "axios";

export async function GET() {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      axios.get(`${process.env.API_URL}/api/get-all-posts`),
      axios.get(`${process.env.API_URL}/api/get-all-categories`),
    ]);

    const posts = postsRes.data;
    const categories = categoriesRes.data;

    const baseUrl = "http://localhost:3000";

    // Static Pages
    const staticPages = [
      { loc: "/", changefreq: "daily", priority: 1.0 },
      { loc: "/terms-of-service", changefreq: "yearly", priority: 0.3 },
      { loc: "/privacy-policy", changefreq: "yearly", priority: 0.3 },
      { loc: "/contact", changefreq: "yearly", priority: 0.3 },
    ];

    const staticUrls = staticPages
      .map(
        (page) => `
<url>
  <loc>${baseUrl}${page.loc}</loc>
  <changefreq>${page.changefreq}</changefreq>
  <priority>${page.priority}</priority>
</url>`
      )
      .join("");

    // Posts
    const postUrls = posts
      .map((post) => {
        return `
<url>
  <loc>${baseUrl}/${post.slug}</loc>
  <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`;
      })
      .join("");

    // Categories
    const categoryUrls = categories
      .map((cat) => {
        return `
<url>
  <loc>${baseUrl}/categories/${cat.name}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.6</priority>
</url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${staticUrls}
${postUrls}
${categoryUrls}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return new Response("Sitemap error", { status: 500 });
  }
}