import fs from "fs";
import path from "path";
import axios from "axios";

const WP_API = "https://dailytrendnews.in/wp-json/wp/v2/posts";
const DEST_API = "http://localhost:8000/api/import-post";
const LOG_FILE = path.join(process.cwd(), "imported.txt");

// Read already imported slugs
const imported = new Set(
  fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, "utf-8").split("\n") : []
);

async function getFeaturedImage(mediaId) {
  if (!mediaId) return null;
  try {
    const res = await axios.get(
      `https://dailytrendnews.in/wp-json/wp/v2/media/${mediaId}`
    );
    return res.data.source_url;
  } catch {
    return null;
  }
}

async function migrate() {
  let page = 1;

  while (true) {
    const { data: posts } = await axios.get(
      `${WP_API}?per_page=10&page=${page}`
    );
    if (!posts.length) break;

    for (const post of posts) {
      if (imported.has(post.slug)) {
        console.log(`⏩ Skipping: ${post.slug}`);
        continue;
      }

      const seo = post.yoast_head_json || {};
      const payload = {
        title: post.title.rendered,
        content: post.content.rendered,
        image: await getFeaturedImage(post.featured_media),
        categories: JSON.stringify(post.categories || []),
        meta_title: seo.title || null,
        meta_description: seo.description || null,
        focus_keyword: seo.focuskw || null,
        slug: post.slug,
        canonical_url: seo.canonical || null,
        robots_tag: "index, follow",
        og_title: seo.og_title || null,
        og_description: seo.og_description || null,
        og_image:
          typeof seo.og_image === "string"
            ? seo.og_image
            : seo.og_image?.[0]?.url || null,
        featured: 0,
        created_at: post.date || new Date().toISOString(),
        updated_at: post.modified || new Date().toISOString(),
        views: 0,
      };

      try {
        await axios.post(DEST_API, payload);
        fs.appendFileSync(LOG_FILE, post.slug + "\n");
        console.log(`✅ Imported: ${post.slug}`);
      } catch (err) {
        console.error(`❌ Failed: ${post.slug}`);
        if (err.response?.data) {
          console.error(JSON.stringify(err.response.data, null, 2));
        } else {
          console.error(err.message);
        }
        // Optional: Stop the loop to debug
        // process.exit(1);
      }
    }

    page++;
  }
}

migrate();