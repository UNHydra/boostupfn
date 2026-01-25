import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import ProductClient from "@/components/ProductClient";

function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const product = PRODUCTS.find((p) => p.slug === resolved.slug);

  if (!product) {
    return {
      title: "BoostUP — Fortnite Services",
      description: "Fortnite boosting and coaching services.",
    };
  }

  const title = `${product.title} — BoostUP`;
  const description =
    product.subtitle || "Secure boosts, fast delivery, and 24/7 Discord support.";

  const ogImage = product.ogImage || "/og.png";


  return {
    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return notFound();

    const baseUrl = "https://YOURDOMAIN.COM"; // domain gelince değiştir
  const url = `${baseUrl}/fortnite/${product.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.subtitle || "Secure boosts, fast delivery, and 24/7 Discord support.",
    brand: { "@type": "Brand", name: "BoostUP" },
    url,
    // Ürün görseli eklediysen (public/og/xxx.png gibi) buraya koy.
    // Eğer Product type'ında ogImage alanı açmadıysan bile JSON-LD içinde kullanabiliriz:
    image: [`${baseUrl}/og/${product.slug}.png`],
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: String(product.rating.score),
          reviewCount: String(product.rating.count),
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(product.basePrice),
      availability: "https://schema.org/InStock",
      url,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Fortnite",
        item: `${baseUrl}/fortnite`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={productJsonLd} />
      <ProductClient product={product} />
    </>
  );

}
