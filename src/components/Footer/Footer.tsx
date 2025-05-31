"use client";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsFooter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    async function getSections() {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");
      await axios
        .get("http://localhost:8000/api/footer-settings")
        .then((res) => {
          setSections(res.data?.sections || []);
        });
    }
    getSections();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie");

      const res = await axios.post("http://localhost:8000/api/subscribe", {
        email,
      });

      setMessage(res.data.message);
      setEmail("");
      setLoading(false);
    } catch (error: any) {
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
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800 transition"
            >
              {loading ? (
                <div className="flex h-screen justify-center items-center">
                  <div className="animate-spin border-2 border-slate-900 border-b-transparent rounded-full size-5"></div>
                </div>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
        </div>

        {/* Footer Columns */}
        {/* <div className="space-y-3">
          <h4 className="font-semibold text-black">News</h4>
          <ul className="space-y-1">
            <li><a href="">World</a></li>
            <li><a href="">Politics</a></li>
            <li><a href="">Business</a></li>
            <li><a href="">Tech</a></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Company</h4>
          <ul className="space-y-1">
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Connect</h4>
          <ul className="space-y-1">
            <li><a href="">Facebook</a></li>
            <li><a href="">Twitter</a></li>
            <li><a href="">Instagram</a></li>
            <li><a href="">YouTube</a></li>
          </ul>
        </div> */}
        {sections.map((section: any, idx: number) => (
          <div key={idx}>
            <h4 className="font-semibold text-black">{section.title}</h4>
            <ul className="space-y-1">
              {section.links.map((link: any, linkIdx: number) => (
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
          {/* <a href="#">Cookies</a>
          <a href="#">Advertise</a> */}
        </div>
      </div>
    </footer>
  );
};

export default NewsFooter;