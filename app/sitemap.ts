import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/data/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.boostupfn.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // statik sayfalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/fortnite`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // product sayfaları (slug)
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((p) => ({
    url: `${SITE_URL}/fortnite/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
