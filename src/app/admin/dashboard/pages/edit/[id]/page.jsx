"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageForm from "../../../../../../components/pages/pageForm";
import SeoSidebar from "../../../../../../components/pages/seoSettingsSidebar";
import { Loader2 } from "lucide-react";

export default function EditPage() {
  const { id } = useParams();
  const [page, setPage] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [slug, setSlug] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsTag, setRobotsTag] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageDataLoading, setPageDataLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    setPageDataLoading(true);
    document.title = "Edit Page";
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
      localStorage.getItem("role") === "admin" ||
      localPerms.includes("create_edit_page");
    setAllowed(allowed);
    if(!allowed) setPageDataLoading(false);
    const fetchPage = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`
        );
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/pages/${id}`
        );
        const pageData = res.data.page;
        setPage(res.data.page);
        setTitle(pageData.title || "");
        setBody(pageData.content || "");
        setMetaTitle(pageData.meta_title || "");
        setMetaDescription(pageData.meta_description || "");
        setFocusKeyword(pageData.focus_keyword || "");
        setSlug(pageData.slug || "");
        setCanonicalUrl(pageData.canonical_url || "");
        setRobotsTag(pageData.robots_tag || "index, follow");
        setOgTitle(pageData.og_title || "");
        setOgDescription(pageData.og_description || "");
        setPageDataLoading(false);
      } catch (err) {
        setPageDataLoading(false);
        console.error("Failed to fetch page:", err);
      }
    };

    if (allowed) fetchPage();
  }, [id]);

  if (!allowed) {
    return (
      <p className="text-red-500">
        You don’t have permission to view this page.
      </p>
    );
  }

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
    // e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", body);
      //   if (image) formData.append("image", image);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("focusKeyword", focusKeyword);
      formData.append("slug", slugify(slug));
      formData.append("canonicalUrl", canonicalUrl);
      formData.append("robotsTag", robotsTag);
      formData.append("ogTitle", ogTitle);
      formData.append("ogDescription", ogDescription);
      //   formData.append("ogImage", ogImage);
      //   formData.append("featured", isFeatured);

      //   selectedCategories.forEach((index) => {
      //     const category = categories[index - 1];
      //     if (category) {
      //       formData.append("categories[]", category.name);
      //     }
      //   });

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);

      // const url = isEdit
      //   ? `${process.env.NEXT_PUBLIC_API_URL}/api/pages/${postId}`
      //   : `${process.env.NEXT_PUBLIC_API_URL}/api/pages`;

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/pages/${id}`;

      // if (isEdit) {
      formData.append("_method", "PUT");
      // }

      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDialogMessage(
        // `Page ${isEdit ? "updated" : "published"} successfully!`
        `Page updated successfully!`
      );
    } catch (err) {
      setDialogMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setOpenDialog(true);
    }
  };

  return (
    <>
      {pageDataLoading ? (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="animate-spin mr-2" />
        </div>
      ) : (
        <div className="flex gap-3">
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
              <Button
                onClick={handleSubmit}
                type="submit"
                disabled={loading}
                className="mt-6 py-6 px-8"
              >
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
            <PageForm
              initialData={page}
              isEdit={true}
              // pageId={id}
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              focusKeyword={focusKeyword}
              slug={slug}
              canonicalUrl={canonicalUrl}
              ogTitle={ogTitle}
              ogDescription={ogDescription}
            />
          </div>
          <SeoSidebar
            //   seoScore={seoScore}
            //   seoFeedback={seoFeedback}
            //   handleImageChange={handleImageChange}
            //   image={image}
            //   imagePreviewUrl={imagePreviewUrl}
            //   imageInputRef={imageInputRef}
            //   setImage={setImage}
            //   isFeatured={isFeatured}
            //   setIsFeatured={setIsFeatured}
            //   selectedCategories={selectedCategories}
            //   handleCategoryChange={handleCategoryChange}
            //   categories={categories}
            //   updateCategories={updateCategories}
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
            //   ogImage={ogImage}
            //   ogImagePreviewUrl={ogImagePreviewUrl}
            //   fileInputRef={fileInputRef}
            //   handleOgImageChange={handleOgImageChange}
            //   setOgImage={setOgImage}
          />
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {dialogMessage.includes("Error") ? "Error" : "Success"}
                </DialogTitle>
                <DialogDescription>{dialogMessage}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setOpenDialog(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}