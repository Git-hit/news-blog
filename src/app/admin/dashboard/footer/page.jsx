"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminFooterSettings() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSections, setLoadingSections] = useState(false);

  useEffect(() => {
    document.title = "Footer Settings";
    async function getSections() {
      setLoadingSections(true);
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/footer-settings`)
        .then((res) => {
          setSections(res.data?.sections || []);
        });
      setLoadingSections(false);
    }
    getSections();
  }, []);

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
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/footer-settings`, {
        sections,
      });
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
        <div className="flex h-screen justify-center items-center">
          <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-10"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h2 className="text-2xl font-bold">Manage Footer Links</h2>

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="border p-4 space-y-2">
              <div className="flex justify-between items-center">
                <input
                  value={section.title}
                  placeholder="Section Title"
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[sIdx].title = e.target.value;
                    setSections(updated);
                  }}
                  className="w-full p-2 border rounded"
                />
                <button
                  className="text-red-500 text-sm ml-2"
                  onClick={() => removeSection(sIdx)}
                >
                  🗑 Remove Section
                </button>
              </div>

              {section.links.map((link, lIdx) => (
                <div key={lIdx} className="flex gap-2 items-center">
                  <input
                    value={link.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIdx].links[lIdx].label = e.target.value;
                      setSections(updated);
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    value={link.url}
                    placeholder="URL"
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIdx].links[lIdx].url = e.target.value;
                      setSections(updated);
                    }}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => removeLink(sIdx, lIdx)}
                  >
                    🗑
                  </button>
                </div>
              ))}

              <button
                className="text-blue-500 text-sm cursor-pointer"
                onClick={() => addLink(sIdx)}
              >
                + Add Link
              </button>
            </div>
          ))}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            onClick={addSection}
          >
            + Add Section
          </button>

          <div>
            <button
              onClick={saveFooter}
              className="bg-green-600 text-white px-6 py-2 mt-4 rounded cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            {message && (
              <p className="mt-2 text-sm text-green-600">{message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}