"use client";
import { Mail } from "lucide-react";
import React from "react";

const NewsFooter = () => {
  return (
    <footer className="bg-[#f9f9f9] border-t text-sm text-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Newsletter */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-3xl font-extrabold text-black">The Daily News</h2>
          <p className="text-sm">
            Breaking stories. Trusted journalism. Global reach. Stay informed
            with NewsChannel.
          </p>
          <form className="flex items-center border rounded-md overflow-hidden max-w-sm bg-white shadow-sm">
            <div className="px-3">
              <Mail className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Subscribe with your email"
              className="flex-1 p-2 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm hover:bg-neutral-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Columns */}
        <div className="space-y-3">
          <h4 className="font-semibold text-black">News</h4>
          <ul className="space-y-1">
            <li>World</li>
            <li>Politics</li>
            <li>Business</li>
            <li>Technology</li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-black">Company</h4>
          <ul className="space-y-1">
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Contact</li>
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
        <p>© 2025 NewsChannel. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookies</a>
          <a href="#">Advertise</a>
        </div>
      </div>
    </footer>
  );
};

export default NewsFooter;