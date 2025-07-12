"use client";

import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  shareType: "watering" | "review" | "bigcard" | string;
}

export default function ShareButton({
  title,
  text,
  url,
  shareType,
}: ShareButtonProps) {
  const [sharedToday, setSharedToday] = useState(false);
  const [shareUrl, setShareUrl] = useState(url || "");

  useEffect(() => {
    if (!url) {
      setShareUrl(window.location.href);
    }
  }, [url]);

  async function handleShare() {
    if (!navigator.share) {
      alert("Your browser does not support Web Share API.");
      return;
    }

    try {
      await navigator.share({ title, text, url: shareUrl });

      if (!sharedToday) {
        const res = await fetchWithAuth(`http://localhost:8000/share/${shareType}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to record share");
        setSharedToday(true);
        alert("🎉 Thanks for sharing! You've earned 10 Green Points.");
      } else {
        alert("✅ You have already shared today.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="bg-white text-green-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-green-50 transition"
    >
      📤 分享
    </button>
  );
}
