"use client";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";

const NewsFooter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    await axios.get("http://localhost:8000/sanctum/csrf-cookie");

    const res = await axios.post("http://localhost:8000/api/subscribe", { email });

    const data = await res.json();

    if (res.ok) {
      setMessage("Subscribed successfully!");
      setEmail("");
    } else {
      setMessage(data.message || "Something went wrong.");
    }
  };
  return (
    <footer className="bg-[#f9f9f9] border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Newsletter */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-3xl font-extrabold text-black">Daily Trend News</h2>
          <p className="text-sm">
            Breaking stories. Trusted journalism. Global reach. Stay informed.
          </p>
          <form onSubmit={handleSubscribe} method="post" action={"#"} className="flex items-center border rounded-md overflow-hidden max-w-sm bg-white shadow-sm">
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
              Subscribe
            </button>
          </form>
          {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
        </div>

        {/* Footer Columns */}
        <div className="space-y-3">
          <h4 className="font-semibold text-black">News</h4>
          <ul className="space-y-1">
            <li>World</li>
            <li>Politics</li>
            <li>Business</li>
            <li>Tech</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Company</h4>
          <ul className="space-y-1">
            {/* <li>About Us</li>
            <li>Careers</li>
            <li>Press</li> */}
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Connect</h4>
          <ul className="space-y-1">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t py-6 text-xs text-gray-500 px-4 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p>© 2025 Daily Trend News. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          {/* <a href="#">Cookies</a>
          <a href="#">Advertise</a> */}
        </div>
      </div>
    </footer>
  );
};

export default NewsFooter;