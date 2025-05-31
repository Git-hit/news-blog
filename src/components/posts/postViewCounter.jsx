"use client";

import axios from "axios";
import { useEffect } from "react";

export default function PostViewCounter({ slug }) {
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;
    async function incrementViews() {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie");
        await axios.post(`http://localhost:8000/api/posts/${slug}/increment-views`);
    }
    incrementViews();
  }, [slug]);

  return null; // no UI
}