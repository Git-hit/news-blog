function fleschReadingEase(text) {
  const sentences = (text.match(/[.!?]+/g) || []).length || 1;
  const words = text.split(/\s+/).filter(Boolean).length || 1;
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

export default function analyzeSeo({
  title,
  content,
  metaTitle,
  metaDescription,
  focusKeyword,
  slug,
  ogTitle,
  ogDescription,
  checkStructuredData,
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
      feedback.push("✅ Meta description length is ideal (120–160 characters)");
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
    if (!feedback.includes("✅ Content length is ideal (at least 300 words)")) {
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
    if (!feedback.includes("❌ Add Open Graph (OG) tags for social sharing")) {
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