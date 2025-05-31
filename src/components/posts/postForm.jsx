"use client";

import { useState, useEffect, useRef } from "react";
import PostEditor from "./postEditor";
import { useRouter } from "next/navigation";
import axios from "axios";
import CategorySelector from "./categorySelector";

export default function PostForm({ initialData = {}, isEdit = false, postId }) {
  const [title, setTitle] = useState(initialData.title || "");
  const [body, setBody] = useState(initialData.content || "");
  const [image, setImage] = useState(initialData.image || "");
  const [metaTitle, setMetaTitle] = useState(initialData.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData.meta_description || ""
  );
  const [focusKeyword, setFocusKeyword] = useState(
    initialData.focus_keyword || ""
  );
  const [slug, setSlug] = useState(initialData.slug || "");
  const [canonicalUrl, setCanonicalUrl] = useState(
    initialData.canonical_url || ""
  );
  const [robotsTag, setRobotsTag] = useState(
    initialData.robots_tag || "index, follow"
  );
  const [ogTitle, setOgTitle] = useState(initialData.og_title || "");
  const [ogDescription, setOgDescription] = useState(
    initialData.og_description || ""
  );
  const [ogImage, setOgImage] = useState(initialData.og_image || "");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // SEO score and feedback
  const [seoScore, setSeoScore] = useState(0);
  const [seoFeedback, setSeoFeedback] = useState([]);

  const [isFeatured, setIsFeatured] = useState(initialData.featured || false);
  // const [isMustRead, setIsMustRead] = useState(false);

  const fileInputRef = useRef();
  const imageInputRef = useRef();

  // Preview the selected image
  const imagePreviewUrl =
    image instanceof File ? URL.createObjectURL(image) : image || "";

  const ogImagePreviewUrl =
    ogImage instanceof File ? URL.createObjectURL(ogImage) : ogImage || "";

  // console.log(imagePreviewUrl, ogImagePreviewUrl)

  const handleCategoryChange = (updatedIds) => {
    setSelectedCategories(updatedIds);
  };

  const updateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  useEffect(() => {
    let parsedCategories = initialData.categories;

    // Convert from JSON string to array if necessary
    if (typeof parsedCategories === "string") {
      try {
        parsedCategories = JSON.parse(parsedCategories);
      } catch (error) {
        console.error("Invalid categories JSON:", error);
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

  // Update Open Graph tags in the <head> whenever they change
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

  // Update SEO meta tags (including robots)
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

  // Helper: Calculate Flesch Reading Ease Score
  function fleschReadingEase(text) {
    // Basic heuristic: sentence count & syllable count
    // Using simple rules for demo (can be improved with better libs)
    // const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
    const sentences = (text.match(/[.!?]+/g) || []).length || 1;
    const words = text.split(/\s+/).filter(Boolean).length || 1;

    // Count syllables (basic heuristic)
    const syllableCount = text
      .toLowerCase()
      .split(/\s+/)
      .reduce((total, word) => {
        // Count vowels groups as syllables approx.
        const syls = word.match(/[aeiouy]{1,2}/g);
        return total + (syls ? syls.length : 1);
      }, 0);

    const asl = words / sentences; // average sentence length
    const asw = syllableCount / words; // average syllables per word

    // Flesch Reading Ease formula
    return 206.835 - 1.015 * asl - 84.6 * asw;
  }

  // Analyze links (basic internal/external count)
  function analyzeLinks(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const anchors = [...doc.querySelectorAll("a")];
    const internalLinks = anchors.filter((a) =>
      a.href.includes(window.location.hostname)
    ).length;
    const externalLinks = anchors.length - internalLinks;
    return { internalLinks, externalLinks };
  }

  // Check for images and alt attributes
  function analyzeImages(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const images = [...doc.querySelectorAll("img")];
    const imagesMissingAlt = images.filter(
      (img) => !img.alt || img.alt.trim() === ""
    ).length;
    return { totalImages: images.length, imagesMissingAlt };
  }

  // Check presence of basic OG tags and structured data JSON-LD in metaTitle & metaDescription
  const checkStructuredData = () => {
    const jsonLdScript = document.querySelector(
      "script[type='application/ld+json']"
    );
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

      const existingScript = document.querySelector(
        "script[type='application/ld+json']"
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(jsonLdData);
        document.head.appendChild(script);
      }
    };

    addJsonLdData(); // Add structured data (JSON-LD)

    const { jsonLdPresent, ogTagsPresent } = checkStructuredData();

    // Recalculate SEO feedback
    setSeoFeedback((prevFeedback) => {
      const updatedFeedback = [...prevFeedback];

      // Check for structured data (JSON-LD)
      if (
        !jsonLdPresent &&
        !updatedFeedback.includes("❌ Add structured data (JSON-LD) for SEO")
      ) {
        updatedFeedback.push("❌ Add structured data (JSON-LD) for SEO");
      } else if (
        jsonLdPresent &&
        !updatedFeedback.includes("✅ Structured data (JSON-LD) is present")
      ) {
        updatedFeedback.push("✅ Structured data (JSON-LD) is present");
      }

      // Check for Open Graph tags
      if (
        ogTagsPresent &&
        !updatedFeedback.includes("✅ Open Graph tags found")
      ) {
        updatedFeedback.push("✅ Open Graph tags found");
      }

      return updatedFeedback;
    });
  }, [metaTitle, metaDescription, canonicalUrl]); // Run when SEO-related states change

  // Main SEO analysis function
  function analyzeSeo({
    title,
    content,
    metaTitle,
    metaDescription,
    focusKeyword,
    slug,
    ogTitle,
    ogDescription,
  }) {
    const feedback = [];
    let score = 0;

    const keyword = focusKeyword.trim().toLowerCase();
    const titleLower = title.toLowerCase();
    const metaTitleLower = metaTitle.toLowerCase();
    const metaDescLower = metaDescription.toLowerCase();
    const contentLower = content.toLowerCase();
    const slugLower = slug.toLowerCase();

    const words = contentLower.split(/\s+/).filter(Boolean).length || 1;

    if (!focusKeyword) {
      feedback.push("❌ Focus keyword is missing");
    } else {
      // Keyword presence checks
      if (titleLower.includes(keyword)) {
        score += 10;
        if (!feedback.includes("✅ Keyword found in post title")) {
          feedback.push("✅ Keyword found in post title");
        }
      } else {
        feedback.push("❌ Keyword not found in post title");
      }

      if (metaTitleLower.includes(keyword)) {
        score += 10;
        if (!feedback.includes("✅ Keyword found in meta title")) {
          feedback.push("✅ Keyword found in meta title");
        }
      } else {
        feedback.push("❌ Keyword not found in meta title");
      }

      if (metaDescLower.includes(keyword)) {
        score += 10;
        if (!feedback.includes("✅ Keyword found in meta description")) {
          feedback.push("✅ Keyword found in meta description");
        }
      } else {
        feedback.push("❌ Keyword not found in meta description");
      }

      if (slugLower.includes(keyword)) {
        score += 10;
        if (!feedback.includes("✅ Keyword found in slug")) {
          feedback.push("✅ Keyword found in slug");
        }
      } else {
        feedback.push("❌ Keyword not found in slug");
      }

      if (contentLower.includes(keyword)) {
        score += 15;
        if (!feedback.includes("✅ Keyword found in post content")) {
          feedback.push("✅ Keyword found in post content");
        }
      } else {
        feedback.push("❌ Keyword not found in post content");
      }

      // Keyword density
      const keywordCount = contentLower.split(keyword).length - 1;
      const density = (keywordCount / words) * 100;
      if (density >= 0.5 && density <= 2.5) {
        score += 10;
        if (
          !feedback.includes(
            `✅ Keyword density is ${density.toFixed(1)}% (ideal: 0.5–2.5%)`
          )
        ) {
          feedback.push(
            `✅ Keyword density is ${density.toFixed(1)}% (ideal: 0.5–2.5%)`
          );
        }
      } else {
        feedback.push(
          `❌ Keyword density is ${density.toFixed(1)}% (ideal: 0.5–2.5%)`
        );
      }
    }

    // Meta title length
    if (metaTitle.length >= 50 && metaTitle.length <= 60) {
      score += 10;
      if (
        !feedback.includes("✅ Meta title length is ideal (50–60 characters)")
      ) {
        feedback.push("✅ Meta title length is ideal (50–60 characters)");
      }
    } else {
      feedback.push("❌ Meta title should be 50–60 characters");
    }

    // Meta description length
    if (metaDescription.length >= 120 && metaDescription.length <= 160) {
      score += 10;
      if (
        !feedback.includes(
          "✅ Meta description length is ideal (120–160 characters)"
        )
      ) {
        feedback.push(
          "✅ Meta description length is ideal (120–160 characters)"
        );
      }
    } else {
      feedback.push("❌ Meta description should be 120–160 characters");
    }

    // Slug length
    if (slug.length > 0 && slug.length <= 75) {
      score += 5;
      if (!feedback.includes("✅ Slug length is ideal (1–75 characters)")) {
        feedback.push("✅ Slug length is ideal (1–75 characters)");
      }
    } else {
      feedback.push("❌ Slug should be between 1 and 75 characters");
    }

    // Content length
    if (words >= 300) {
      score += 10;
      if (
        !feedback.includes("✅ Content length is ideal (at least 300 words)")
      ) {
        feedback.push("✅ Content length is ideal (at least 300 words)");
      }
    } else {
      feedback.push("❌ Content should be at least 300 words");
    }

    // Reading ease
    const readingScore = fleschReadingEase(content.replace(/<img[^>]*>/g, ""));
    if (readingScore >= 60) {
      score += 5;
      if (
        !feedback.includes(
          `✅ Reading ease score is ${readingScore.toFixed(0)} (ideal >= 60)`
        )
      ) {
        feedback.push(
          `✅ Reading ease score is ${readingScore.toFixed(0)} (ideal >= 60)`
        );
      }
    } else {
      feedback.push(
        `❌ Reading ease score is ${readingScore.toFixed(0)} (ideal >= 60)`
      );
    }

    // Link analysis
    const { internalLinks, externalLinks } = analyzeLinks(content);
    if (internalLinks > 0) {
      score += 3;
      if (!feedback.includes("✅ Internal link(s) found")) {
        feedback.push("✅ Internal link(s) found");
      }
    } else {
      feedback.push("❌ Add at least one internal link");
    }

    if (externalLinks > 0) {
      score += 3;
      if (!feedback.includes("✅ External link(s) found")) {
        feedback.push("✅ External link(s) found");
      }
    } else {
      feedback.push("❌ Add at least one external link");
    }

    // Image alt text analysis
    const { totalImages, imagesMissingAlt } = analyzeImages(content);
    if (totalImages === 0) {
      feedback.push("❌ Add at least one image with alt text");
    } else {
      if (imagesMissingAlt === 0) {
        score += 4;
        if (!feedback.includes("✅ All images have alt text")) {
          feedback.push("✅ All images have alt text");
        }
      } else {
        feedback.push(`❌ ${imagesMissingAlt} image(s) missing alt text`);
      }
    }

    // Structured data and OG tags
    const { ogTagsPresent, jsonLdPresent } = checkStructuredData();
    if (ogTagsPresent) {
      score += 5;
      if (!feedback.includes("✅ Open Graph tags found")) {
        feedback.push("✅ Open Graph tags found");
      }
    } else {
      if (
        !feedback.includes("❌ Add Open Graph (OG) tags for social sharing")
      ) {
        feedback.push("❌ Add Open Graph (OG) tags for social sharing");
      }
    }

    if (jsonLdPresent) {
      score += 5;
      if (!feedback.includes("✅ Structured data (JSON-LD) is present")) {
        feedback.push("✅ Structured data (JSON-LD) is present");
      }
    } else {
      if (!feedback.includes("❌ Add structured data (JSON-LD) for SEO")) {
        feedback.push("❌ Add structured data (JSON-LD) for SEO");
      }
    }

    // Open Graph (OG) title and description
    if (ogTitle) {
      score += 5;
      if (!feedback.includes("✅ Open Graph title for social sharing")) {
        feedback.push("✅ Open Graph title for social sharing");
      }
    } else {
      if (!feedback.includes("❌ Add Open Graph title for social sharing")) {
        feedback.push("❌ Add Open Graph title for social sharing");
      }
    }

    if (ogDescription) {
      score += 5;
      if (!feedback.includes("✅ Open Graph description for social sharing")) {
        feedback.push("✅ Open Graph description for social sharing");
      }
    } else {
      if (
        !feedback.includes("❌ Add Open Graph description for social sharing")
      ) {
        feedback.push("❌ Add Open Graph description for social sharing");
      }
    }

    // Clamp score to max 100
    return {
      score: Math.min(score, 100),
      feedback,
    };
  }

  // Recalculate SEO score & feedback whenever relevant fields change
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
    });
    setSeoScore(score);
    setSeoFeedback(feedback);
  }, [
    title,
    body,
    metaTitle,
    metaDescription,
    focusKeyword,
    slug,
    ogTitle,
    ogDescription,
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleOgImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOgImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //   console.log(categories, selectedCategories);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", body);
      //   formData.append("image", image); // Append the image file
      if (image) formData.append("image", image);
      // formData.append("categories", selectedCategories);
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
      // formData.append("mustRead", isMustRead);

      selectedCategories.forEach((selectedIndex) => {
        const category = categories[selectedIndex - 1]; // -1 because selectedCategories start from 1
        if (category) {
          formData.append("categories[]", category.name); // ✅ Send name
        }
      });

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);

      const url = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
      const method = isEdit ? "post" : "post"; // still POST, with `_method: PUT`

      if (isEdit) {
        formData.append("_method", "PUT");
      }

      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(res);

      // if (res.data.status !== 200) throw new Error("Failed to save post");

      alert(`Post ${isEdit ? "updated" : "published"}!`);

      //   setTitle("");
      //   setBody("");
      //   setMetaTitle("");
      //   setMetaDescription("");
      //   setFocusKeyword("");
      //   setSlug("");
      //   setCanonicalUrl("");
      //   setRobotsTag("index, follow");
      //   setOgTitle("");
      //   setOgDescription("");
      //   setOgImage("");
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphen
      .replace(/[^a-z0-9-]+/g, "") // Remove invalid chars except hyphen
      .replace(/-+/g, "-") // Replace multiple hyphens with one
      .replace(/^-+/, "") // Trim hyphens from start
      .replace(/-+$/, ""); // Trim hyphens from end
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-7xl mx-auto p-6 gap-8 min-h-screen"
    >
      {/* Main editor area */}
      <div className="flex-1 min-w-0">
        <PostEditor
          title={title}
          content={body}
          onTitleChange={setTitle}
          onChange={setBody}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Publish"}
        </button>
      </div>

      {/* Sidebar SEO settings and score */}
      <aside className="w-96 sticky top-16 self-start space-y-6 border-l border-gray-200 pl-6 overflow-y-auto max-h-[90vh]">
        {/* SEO Score on top */}
        <div>
          <h3 className="font-semibold text-lg">
            SEO Score:{" "}
            <span
              className={
                seoScore >= 75
                  ? "text-green-600"
                  : seoScore >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {seoScore}%
            </span>
          </h3>
          {seoFeedback.length === 0 && (
            <p className="text-green-700">🎉 All good!</p>
          )}
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1 max-h-48 overflow-y-auto">
            {seoFeedback.map((item, i) => (
              <li
                key={i}
                className={
                  item.startsWith("❌") ? "text-red-600" : "text-green-600"
                }
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* SEO Settings form */}
        <div>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Thumbnail
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="imageHint"
                ref={imageInputRef}
              />
              <p id="imageHint" className="text-xs text-gray-500 mt-1">
                Choose an image. Supported formats: JPEG, PNG.
              </p>
            </div>
            {image && (
              <div className="flex items-center space-x-4 mt-2">
                <img
                  src={
                    image instanceof File
                      ? imagePreviewUrl // use blob URL directly
                      : `${process.env.NEXT_PUBLIC_API_URL}/storage/${imagePreviewUrl}` // backend image
                  }
                  alt="Image preview"
                  className="w-32 h-32 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null); // Clear the image state
                    imageInputRef.current.value = ""; // Reset file input value
                  }}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
                  aria-label="Remove Image"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center">
              <input
                id="featured"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="featured"
                className="ml-2 block text-sm text-gray-700"
              >
                Featured
              </label>
            </div>

            {/* <div className="flex items-center">
              <input
                id="mustRead"
                type="checkbox"
                checked={isMustRead}
                onChange={(e) => setIsMustRead(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="mustRead"
                className="ml-2 block text-sm text-gray-700"
              >
                Must Read
              </label>
            </div> */}
          </div>

          {/* Category Selection */}
          <CategorySelector
            selectedCategories={selectedCategories}
            onChange={handleCategoryChange}
            categories={categories}
            setCategories={updateCategories}
          />

          <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

          {/* Meta Title */}
          <label className="block">
            <span className="font-medium">Meta Title</span>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="SEO Meta Title (50-60 chars)"
            />
          </label>

          {/* Meta Description */}
          <label className="block">
            <span className="font-medium">Meta Description</span>
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="SEO Meta Description (120-160 chars)"
            />
          </label>

          {/* Focus Keyword */}
          <label className="block">
            <span className="font-medium">Focus Keyword</span>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="Primary focus keyword"
            />
          </label>

          {/* Slug */}
          <label className="block">
            <span className="font-medium">Slug (URL)</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              // onChange={(e) => setSlug(() => slugify(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="URL slug"
            />
          </label>

          {/* Canonical URL */}
          <label className="block">
            <span className="font-medium">Canonical URL</span>
            <input
              type="text"
              value={canonicalUrl}
              // onChange={(e) => setCanonicalUrl(e.target.value)}
              onChange={(e) => {
                let value = e.target.value.trim();

                // Automatically prepend "https://" if missing and not empty
                if (value && !/^https?:\/\//i.test(value)) {
                  value = "https://" + value;
                }

                // Optional: Remove invalid URL characters (basic filtering)
                value = value.replace(/[^a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]/g, "");

                setCanonicalUrl(value);
              }}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="Canonical URL (optional)"
            />
          </label>

          {/* Robots meta tag */}
          <label className="block">
            <span className="font-medium">Robots Meta Tag</span>
            <select
              value={robotsTag}
              onChange={(e) => setRobotsTag(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
            </select>
          </label>

          {/* Open Graph Title */}
          <label className="block">
            <span className="font-medium">Open Graph Title</span>
            <input
              type="text"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="Open Graph title for social sharing"
            />
          </label>

          {/* Open Graph Description */}
          <label className="block">
            <span className="font-medium">Open Graph Description</span>
            <textarea
              rows={3}
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="Open Graph description for social sharing"
            />
          </label>

          {/* Open Graph Image */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="ogImage"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Open Graph Image
              </label>
              <input
                type="file"
                id="ogImage"
                accept="image/*"
                onChange={handleOgImageChange}
                className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-describedby="ogImageHint"
                ref={fileInputRef}
              />
              <p id="ogImageHint" className="text-xs text-gray-500 mt-1">
                Choose an image for your Open Graph preview. Supported formats:
                JPEG, PNG.
              </p>
            </div>
            {ogImage && (
              <div className="flex items-center space-x-4 mt-2">
                <img
                  src={
                    ogImage instanceof File
                      ? ogImagePreviewUrl // use blob URL directly
                      : `${process.env.NEXT_PUBLIC_API_URL}/storage/${ogImagePreviewUrl}` // backend image
                  }
                  alt="OG Image preview"
                  className="w-32 h-32 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setOgImage(null); // Clear the image state
                    fileInputRef.current.value = ""; // Reset file input value
                  }}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
                  aria-label="Remove Image"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
} 