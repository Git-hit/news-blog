"use client";

import axios from "axios";
import { useEffect } from "react";

export default function PostViewCounter({ slug }) {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    async function incrementViews() {
        await axios.get(`${process.env.API_URL}/sanctum/csrf-cookie`);
        await axios.post(`${process.env.API_URL}/api/posts/${slug}/increment-views`);
    }
    incrementViews();
  }, [slug]);

  return null; // no UI
}