"use client";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsFooter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function getSections() {
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
    }
    getSections();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subscribe`, {
        email,
      });

      setMessage(res.data.message);
      setEmail("");
      setLoading(false);
      setSubscribed(true);
    } catch (error) {
      setLoading(true);
      if (error.response?.status === 422) {
        setMessage(error.response.data.message || "Invalid input.");
      } else {
        setMessage("Something went wrong.");
      }
    }
  };
  return (
    <footer className="bg-[#f9f9f9] border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Newsletter */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-3xl font-extrabold text-black">
            Daily Trend News
          </h2>
          <p className="text-sm">
            Breaking stories. Trusted journalism. Global reach. Stay informed.
          </p>
          <form
            onSubmit={handleSubscribe}
            method="post"
            action={"#"}
            className="flex items-center border rounded-md overflow-hidden max-w-sm bg-white shadow-sm"
          >
            <div className="px-3">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Subscribe to our newsletter"
              className="flex-1 p-2 text-sm outline-none"
              required
            />
            <button
              disabled={subscribed}
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800 transition cursor-pointer"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin border-2 border-gray-200 border-b-transparent rounded-full size-5"></div>
                </div>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
        </div>
        {sections.map((section, idx) => (
          <div key={idx}>
            <h4 className="font-semibold text-black">{section.title}</h4>
            <ul className="space-y-1">
              {section.links.map((link, linkIdx) => (
                <li key={linkIdx}>
                  <a href={link.url} className="text-sm text-gray-600">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Footer */}
      <div className="border-t py-6 text-xs text-gray-500 px-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2025 Daily Trend News. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <a href="/terms-of-service">Terms of Service</a>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default NewsFooter;