"use client";

import { useEffect } from "react";

export function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    if (imageUrls.length === 0) return;

    const images = imageUrls.map((url) => {
      const img = new Image();
      img.src = url;
      return img;
    });

    return () => {
      images.forEach((img) => {
        img.src = "";
      });
    };
  }, [imageUrls.join("|")]);
}
