"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function AdminFooterSettings() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSections, setLoadingSections] = useState(false);
  const [allowed, setAllowed] = useState();

  useEffect(() => {
    document.title = "Footer Settings";
    async function getSections() {
      setLoadingSections(true);
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;

      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/footer-settings`)
        .then((res) => {
          const rawSections = res.data?.sections;

          let parsedSections = [];

          try {
            parsedSections =
              typeof rawSections === "string"
                ? JSON.parse(rawSections)
                : rawSections;
          } catch (err) {
            console.error("Failed to parse sections", err);
          }

          setSections(parsedSections || []);
        });

      setLoadingSections(false);
    }
    const localPerms = JSON.parse(localStorage.getItem("permissions") || "[]");
    const allowed =
      localStorage.getItem("role") === "admin" ||
      localPerms.includes("manage_footer_settings");
    setAllowed(allowed);
    if (allowed) getSections();
  }, []);

  if (!allowed) {
    return (
      <p className="text-red-500">
        You don’t have permission to view this page.
      </p>
    );
  }

  const addSection = () => {
    setSections([...sections, { title: "", links: [] }]);
  };

  const addLink = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].links.push({ label: "", url: "" });
    setSections(updated);
  };

  const saveFooter = async () => {
    setMessage("");
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/footer-settings`,
        {
          sections,
        }
      );
      setMessage("Footer saved!");
    } catch (err) {
      setMessage("Save failed.");
    }
    setLoading(false);
  };

  const removeSection = (sectionIndex) => {
    const updated = [...sections];
    updated.splice(sectionIndex, 1);
    setSections(updated);
  };

  const removeLink = (sectionIndex, linkIndex) => {
    const updated = [...sections];
    updated[sectionIndex].links.splice(linkIndex, 1);
    setSections(updated);
  };

  return (
    <>
      {loadingSections ? (
        <div className="flex justify-center items-center p-6">
          <Loader2 className="animate-spin mr-2" />
        </div>
      ) : (
        <div className="max-w-6xl w-6xl mx-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold">Manage Footer Links</h2>
          {sections &&
            sections.map((section, sIdx) => (
              <div key={sIdx} className="border p-4 space-y-4 rounded-md">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`section-title-${sIdx}`} className="mb-1">
                      Section Title
                    </Label>
                    <Input
                      id={`section-title-${sIdx}`}
                      value={section.title}
                      placeholder="Section Title"
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[sIdx].title = e.target.value;
                        setSections(updated);
                      }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(sIdx)}
                  >
                    🗑 Remove Section
                  </Button>
                </div>

                {section.links.map((link, lIdx) => (
                  <div key={lIdx} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label
                        htmlFor={`link-label-${sIdx}-${lIdx}`}
                        className="mb-1"
                      >
                        Label
                      </Label>
                      <Input
                        id={`link-label-${sIdx}-${lIdx}`}
                        value={link.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].links[lIdx].label = e.target.value;
                          setSections(updated);
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={`link-url-${sIdx}-${lIdx}`}
                        className="mb-1"
                      >
                        URL
                      </Label>
                      <Input
                        id={`link-url-${sIdx}-${lIdx}`}
                        value={link.url}
                        placeholder="URL"
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].links[lIdx].url = e.target.value;
                          setSections(updated);
                        }}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeLink(sIdx, lIdx)}
                    >
                      🗑
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addLink(sIdx)}
                >
                  + Add Link
                </Button>
              </div>
            ))}

          <Button onClick={addSection} className="w-full">
            + Add Section
          </Button>

          <div>
            <Button
              onClick={saveFooter}
              disabled={loading}
              className="mt-4 w-full"
              variant="default"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            {message && (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}