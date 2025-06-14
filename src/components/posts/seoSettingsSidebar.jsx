import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sidebar } from "@/components/ui/sidebar";
import CategorySelector from "./categorySelector";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SeoSidebar({
  seoScore,
  seoFeedback,
  handleImageChange,
  image,
  imagePreviewUrl,
  imageInputRef,
  setImage,
  isFeatured,
  setIsFeatured,
  selectedCategories,
  handleCategoryChange,
  categories,
  updateCategories,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  focusKeyword,
  setFocusKeyword,
  slug,
  setSlug,
  canonicalUrl,
  setCanonicalUrl,
  robotsTag,
  setRobotsTag,
  ogTitle,
  setOgTitle,
  ogDescription,
  setOgDescription,
  ogImage,
  ogImagePreviewUrl,
  fileInputRef,
  handleOgImageChange,
  setOgImage,
}) {
  const [imageLoading, setImageLoading] = useState(false);
  const [ogImageLoading, setOgImageLoading] = useState(false);

  const onImageChange = (e) => {
    if (e.target.files?.length) {
      setImageLoading(true);
      handleImageChange(e);
      setTimeout(() => setImageLoading(false), 700);
    }
  };

  const onOgImageChange = (e) => {
    if (e.target.files?.length) {
      setOgImageLoading(true);
      handleOgImageChange(e);
      setTimeout(() => setOgImageLoading(false), 700);
    }
  };

  return (
    <Sidebar className="w-96 sticky top-0 self-start overflow-y-auto max-h-[90vh] border-l pl-6 py-6 bg-white shadow-sm rounded-md">
      {/* SEO Score Section */}
      <section className="pb-4 border-b mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
          SEO Score:
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
        {seoFeedback.length === 0 ? (
          <p className="mt-2 text-green-700 flex items-center gap-1 text-sm font-medium">
            🎉 All good!
          </p>
        ) : (
          <ul className="list-disc list-inside text-sm text-muted-foreground max-h-48 overflow-y-auto space-y-1">
            {seoFeedback.map((item, i) => (
              <li
                key={i}
                className={item.startsWith("❌") ? "text-red-600" : "text-green-600"}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Thumbnail Image Upload */}
      <section className="space-y-3 mb-6">
        <Label htmlFor="image" className="font-semibold block">
          Thumbnail
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          ref={imageInputRef}
          aria-describedby="thumbnail-help"
        />
        <p id="thumbnail-help" className="text-xs text-muted-foreground">
          Choose an image. Supported formats: JPEG, PNG.
        </p>

        {imageLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {!imageLoading && image && (
          <div className="flex items-center space-x-4 mt-2">
            <img
              src={
                image instanceof File
                  ? imagePreviewUrl
                  : `${imagePreviewUrl}`
              }
              alt="Image preview"
              className="w-32 h-32 object-cover rounded-md shadow-md border border-gray-200"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setImage(null);
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove thumbnail image"
            >
              Remove
            </Button>
          </div>
        )}
      </section>

      {/* Featured Checkbox */}
      <section className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="featured"
          checked={isFeatured}
          onCheckedChange={setIsFeatured}
          aria-describedby="featured-desc"
        />
        <Label htmlFor="featured" className="select-none cursor-pointer">
          Featured
        </Label>
      </section>

      {/* Category Selector */}
      <section className="mb-8">
        <CategorySelector
          selectedCategories={selectedCategories}
          onChange={handleCategoryChange}
          categories={categories}
          setCategories={updateCategories}
        />
      </section>

      <h2 className="text-xl font-semibold mb-6 border-t pt-6">SEO Settings</h2>

      {/* Meta Title */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="SEO Meta Title (50-60 chars)"
          maxLength={60}
          spellCheck={false}
          aria-describedby="metaTitle-desc"
        />
        <p id="metaTitle-desc" className="text-xs text-muted-foreground">
          Recommended length: 50-60 characters.
        </p>
      </section>

      {/* Meta Description */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          rows={3}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="SEO Meta Description (120-160 chars)"
          maxLength={160}
          spellCheck={false}
          aria-describedby="metaDescription-desc"
        />
        <p id="metaDescription-desc" className="text-xs text-muted-foreground">
          Recommended length: 120-160 characters.
        </p>
      </section>

      {/* Focus Keyword */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="focusKeyword">Focus Keyword</Label>
        <Input
          id="focusKeyword"
          value={focusKeyword}
          onChange={(e) => setFocusKeyword(e.target.value)}
          placeholder="Primary focus keyword"
          spellCheck={false}
        />
      </section>

      {/* Slug */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="URL slug"
          spellCheck={false}
        />
      </section>

      {/* Canonical URL */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="canonicalUrl">Canonical URL</Label>
        <Input
          id="canonicalUrl"
          value={canonicalUrl}
          onChange={(e) => {
            let value = e.target.value.trim();
            if (value && !/^https?:\/\//i.test(value)) {
              value = "https://" + value;
            }
            value = value.replace(/[^a-zA-Z0-9-._~:/?#@!$&'()*+,;=%]/g, "");
            setCanonicalUrl(value);
          }}
          placeholder="Canonical URL (optional)"
          spellCheck={false}
        />
      </section>

      {/* Robots Meta Tag */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="robotsTag">Robots Meta Tag</Label>
        <Select value={robotsTag} onValueChange={setRobotsTag}>
          <SelectTrigger aria-label="Robots meta tag selection" />
          <SelectValue placeholder="Select robots tag" />
          <SelectContent>
            <SelectItem value="index, follow">index, follow</SelectItem>
            <SelectItem value="noindex, nofollow">noindex, nofollow</SelectItem>
            <SelectItem value="noindex, follow">noindex, follow</SelectItem>
            <SelectItem value="index, nofollow">index, nofollow</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* OG Title */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="ogTitle">Open Graph Title</Label>
        <Input
          id="ogTitle"
          value={ogTitle}
          onChange={(e) => setOgTitle(e.target.value)}
          placeholder="Open Graph title for social sharing"
          spellCheck={false}
        />
      </section>

      {/* OG Description */}
      <section className="space-y-1 mb-5">
        <Label htmlFor="ogDescription">Open Graph Description</Label>
        <Textarea
          id="ogDescription"
          rows={3}
          value={ogDescription}
          onChange={(e) => setOgDescription(e.target.value)}
          placeholder="Open Graph description for social sharing"
          spellCheck={false}
        />
      </section>

      {/* OG Image Upload */}
      <section className="space-y-3 mb-6">
        <Label htmlFor="ogImage" className="font-semibold block">
          Open Graph Image
        </Label>
        <Input
          id="ogImage"
          type="file"
          accept="image/*"
          onChange={onOgImageChange}
          ref={fileInputRef}
          aria-describedby="ogImage-help"
        />
        <p id="ogImage-help" className="text-xs text-muted-foreground">
          Choose an image for social preview. Formats: JPEG, PNG.
        </p>

        {ogImageLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {!ogImageLoading && ogImage && (
          <div className="flex items-center space-x-4 mt-2">
            <img
              src={
                ogImage instanceof File
                  ? ogImagePreviewUrl
                  : `${ogImagePreviewUrl}`
              }
              alt="OG Image preview"
              className="w-32 h-32 object-cover rounded-md shadow-md border border-gray-200"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOgImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-red-600 hover:text-red-800"
              aria-label="Remove OG image"
            >
              Remove
            </Button>
          </div>
        )}
      </section>
    </Sidebar>
  );
}