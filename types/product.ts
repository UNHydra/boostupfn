export type Rating = {
  score: number;
  count: number;
};

export type Variant = {
  id: string;
  label: string;        // "1000 V-Bucks" gibi
  amount: number;       // 1000, 2000...
  price: number;        // bizdeki fiyat ($)
  msrp: number;         // oyundaki fiyat ($)
  deliveryTime: string; // "9 min - 20 min"
  deliveryMethod: string; // "Login Top Up"
};

export type Product = {
  slug: string;
  title: string;
  subtitle: string;
  ogImage?: string;
  


  // Kartlarda görünen "from $X" için
  basePrice: number;

  heroBadges: string[];
  rating: Rating;

  platforms: string[];
  description: string[];

  // Sadece V-Bucks'ta kullanacağız
  variants?: Variant[];
};
