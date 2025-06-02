"use client";

import axios from "axios";
import { useEffect } from "react";

export default function PostViewCounter({ slug, type }) {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    async function incrementViews() {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`);
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/${type}/${slug}/increment-views`);
    }
    incrementViews();
  }, [slug]);

  return null; // no UI
}