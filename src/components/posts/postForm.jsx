import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PostEditor from "./postEditor";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SeoSidebar from "./seoSettingsSidebar";
import analyzeSeo from "./analyzeSeo";
import axios from "axios";

export default function PostForm({ initialData = {}, isEdit = false, postId }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [body, setBody] = useState(initialData.content || "");
  const [image, setImage] = useState(initialData.image || "");
  const [metaTitle, setMetaTitle] = useState(initialData.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData.meta_description || "");
  const [focusKeyword, setFocusKeyword] = useState(initialData.focus_keyword || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData.canonical_url || "");
  const [robotsTag, setRobotsTag] = useState(initialData.robots_tag || "index, follow");
  const [ogTitle, setOgTitle] = useState(initialData.og_title || "");
  const [ogDescription, setOgDescription] = useState(initialData.og_description || "");
  const [ogImage, setOgImage] = useState(initialData.og_image || "");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [seoScore, setSeoScore] = useState(0);
  const [seoFeedback, setSeoFeedback] = useState([]);

  const [isFeatured, setIsFeatured] = useState(initialData.featured || false);

  const fileInputRef = useRef();
  const imageInputRef = useRef();

  const imagePreviewUrl = image instanceof File ? URL.createObjectURL(image) : image || "";
  const ogImagePreviewUrl = ogImage instanceof File ? URL.createObjectURL(ogImage) : ogImage || "";

  const router = useRouter();

  const handleCategoryChange = (updatedIds) => {
    setSelectedCategories(updatedIds);
  };

  const updateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  useEffect(() => {
    let parsedCategories = initialData.categories;

    if (typeof parsedCategories === "string") {
      try {
        parsedCategories = JSON.parse(parsedCategories);
      } catch {
        parsedCategories = [];
      }
    }

    if (Array.isArray(parsedCategories) && categories.length > 0) {
      const mappedIndexes = parsedCategories
        .map((catName) => {
          const index = categories.findIndex((c) => c.name === catName);
          return index !== -1 ? index + 1 : null;
        })
        .filter((i) => i !== null);

      setSelectedCategories(mappedIndexes);
    }
  }, [initialData.categories, categories]);

  useEffect(() => {
    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property='${property}']`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (ogTitle) setMeta("og:title", ogTitle);
    if (ogDescription) setMeta("og:description", ogDescription);
    if (ogImage) setMeta("og:image", ogImage);
    if (canonicalUrl) setMeta("og:url", canonicalUrl);
  }, [ogTitle, ogDescription, ogImage, canonicalUrl]);

  useEffect(() => {
    const name = "robots";
    let el = document.querySelector(`meta[name='${name}']`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", robotsTag);
  }, [robotsTag]);

  const checkStructuredData = () => {
    const jsonLdScript = document.querySelector("script[type='application/ld+json']");
    const ogTags = document.querySelector("meta[property^='og:']");
    return {
      jsonLdPresent: !!jsonLdScript,
      ogTagsPresent: !!ogTags,
    };
  };

  useEffect(() => {
    const addJsonLdData = () => {
      const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
      };

      const existingScript = document.querySelector("script[type='application/ld+json']");
      if (!existingScript) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLdData);
        document.head.appendChild(script);
      }
    };

    addJsonLdData();

    const { jsonLdPresent, ogTagsPresent } = checkStructuredData();

    setSeoFeedback((prevFeedback) => {
      const updatedFeedback = [...prevFeedback];

      if (!jsonLdPresent && !updatedFeedback.includes("❌ Add structured data (JSON-LD) for SEO")) {
        updatedFeedback.push("❌ Add structured data (JSON-LD) for SEO");
      } else if (jsonLdPresent && !updatedFeedback.includes("✅ Structured data (JSON-LD) is present")) {
        updatedFeedback.push("✅ Structured data (JSON-LD) is present");
      }

      if (ogTagsPresent && !updatedFeedback.includes("✅ Open Graph tags found")) {
        updatedFeedback.push("✅ Open Graph tags found");
      }

      return updatedFeedback;
    });
  }, [metaTitle, metaDescription, canonicalUrl]);

  useEffect(() => {
    const { score, feedback } = analyzeSeo({
      title,
      content: body,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      ogTitle,
      ogDescription,
      checkStructuredData,
    });
    setSeoScore(score);
    setSeoFeedback(feedback);
  }, [title, body, metaTitle, metaDescription, focusKeyword, slug, ogTitle, ogDescription]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleOgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setOgImage(file);
  };

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", body);
      if (image) formData.append("image", image);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("focusKeyword", focusKeyword);
      formData.append("slug", slugify(slug));
      formData.append("canonicalUrl", canonicalUrl);
      formData.append("robotsTag", robotsTag);
      formData.append("ogTitle", ogTitle);
      formData.append("ogDescription", ogDescription);
      formData.append("ogImage", ogImage);
      formData.append("featured", isFeatured);

      selectedCategories.forEach((index) => {
        const category = categories[index - 1];
        if (category) {
          formData.append("categories[]", category.name);
        }
      });

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;

      if (isEdit) {
        formData.append("_method", "PUT");
      }

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDialogMessage(`Post ${isEdit ? "updated" : "published"} successfully!`);
    } catch (err) {
      setDialogMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex max-w-7xl mx-auto p-6 gap-8">
        <div className="flex-1 min-w-0">
          <PostEditor title={title} content={body} onTitleChange={setTitle} onChange={setBody} />
          <Button type="submit" disabled={loading} className="mt-6">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              "Publish"
            )}
          </Button>
        </div>

        <SeoSidebar
          seoScore={seoScore}
          seoFeedback={seoFeedback}
          handleImageChange={handleImageChange}
          image={image}
          imagePreviewUrl={imagePreviewUrl}
          imageInputRef={imageInputRef}
          setImage={setImage}
          isFeatured={isFeatured}
          setIsFeatured={setIsFeatured}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
          updateCategories={updateCategories}
          metaTitle={metaTitle}
          setMetaTitle={setMetaTitle}
          metaDescription={metaDescription}
          setMetaDescription={setMetaDescription}
          focusKeyword={focusKeyword}
          setFocusKeyword={setFocusKeyword}
          slug={slug}
          setSlug={setSlug}
          canonicalUrl={canonicalUrl}
          setCanonicalUrl={setCanonicalUrl}
          robotsTag={robotsTag}
          setRobotsTag={setRobotsTag}
          ogTitle={ogTitle}
          setOgTitle={setOgTitle}
          ogDescription={ogDescription}
          setOgDescription={setOgDescription}
          ogImage={ogImage}
          ogImagePreviewUrl={ogImagePreviewUrl}
          fileInputRef={fileInputRef}
          handleOgImageChange={handleOgImageChange}
          setOgImage={setOgImage}
        />
      </form>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessage.includes("Error") ? "Error" : "Success"}</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}