import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
  slug: "level-boost",
  title: "Fortnite Level Boost",
  subtitle: "Choose your target level and get fast delivery.",
  basePrice: 9,
  ogImage: "/og/level.png",
  heroBadges: ["Fast Delivery", "Secure", "Support 24/7"],
  rating: { score: 5.0, count: 612 },
  platforms: ["PC", "PS", "XBOX"],
  description: [
    "Select your current level and target level.",
    "Safety method and fast completion.",
    "Live support included.",
  ],
  variants: [
    { id: "lvl-10", label: "10 Levels", amount: 10, price: 9, msrp: 15, deliveryTime: "1-3 days", deliveryMethod: "Account Login" },
    { id: "lvl-25", label: "25 Levels", amount: 25, price: 19, msrp: 30, deliveryTime: "2-6 days", deliveryMethod: "Account Login" },
    { id: "lvl-50", label: "50 Levels", amount: 50, price: 35, msrp: 60, deliveryTime: "2-10 days", deliveryMethod: "Account Login" },
    { id: "lvl-100", label: "100 Levels", amount: 100, price: 65, msrp: 120, deliveryTime: "5-10 days", deliveryMethod: "Account Login" },
  ],
},
{
  slug: "ranked-boost",
  title: "Fortnite Ranked Boost",
  subtitle: "Reach your desired rank with pro players.",
  basePrice: 15,
  ogImage: "/og/ranked.png",
  heroBadges: ["Any Rank", "Fast", "Secure"],
  rating: { score: 5.0, count: 934 },
  platforms: ["PC", "PS", "XBOX"],
  description: [
    "Choose your current rank and desired rank.",
    "Duo queue or account login options.",
    "Fast completion & support included.",
  ],
  variants: [
    { id: "rank-bronze-gold", label: "Bronze → Gold", amount: 1, price: 15, msrp: 25, deliveryTime: "1-6 hours", deliveryMethod: "Duo Queue" },
    { id: "rank-gold-plat", label: "Gold → Platinum", amount: 1, price: 25, msrp: 40, deliveryTime: "6-12 hours", deliveryMethod: "Duo Queue" },
    { id: "rank-plat-diamond", label: "Platinum → Diamond", amount: 1, price: 45, msrp: 70, deliveryTime: "12-24 hours", deliveryMethod: "Duo Queue" },
    { id: "rank-diamond-elite", label: "Diamond → Elite", amount: 1, price: 65, msrp: 95, deliveryTime: "1-2 days", deliveryMethod: "Duo Queue" },
  ],
},

  {
    slug: "v-bucks",
    title: "Fortnite V-Bucks",
    subtitle: "",
    basePrice: 6,
    ogImage: "/og/vbucks.png",
    heroBadges: ["Quick Delivery", "Secure Payments", "24/7 Support"],
    rating: { score: 5.0, count: 1448 },
    platforms: ["PC", "PS", "XBOX"],
    description: [],
    variants: [
      { id: "1000", label: "1000 V-Bucks", amount: 1000, price: 6, msrp: 8.99, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "2000", label: "2000 V-Bucks", amount: 2000, price: 11, msrp: 17.98, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "2800", label: "2800 V-Bucks", amount: 2800, price: 16, msrp: 22.99, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "5000", label: "5000 V-Bucks", amount: 5000, price: 25, msrp: 36.99, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "10000", label: "10000 V-Bucks", amount: 10000, price: 45, msrp: 73.98, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "13500", label: "13500 V-Bucks", amount: 13500, price: 65, msrp: 89.99, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "27000", label: "27000 V-Bucks", amount: 27000, price: 110, msrp: 179.98, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
      { id: "54000", label: "54000 V-Bucks", amount: 54000, price: 200, msrp: 359.96, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },

      // CREW PACK (amount'i 0 bırakıyoruz, ekranda label ile göstereceğiz)
      { id: "crew-1m", label: "Fortnite Crew - 1 Month", amount: 0, price: 7, msrp: 11.99, deliveryTime: "9 min - 20 min", deliveryMethod: "Login Top Up" },
    ],
  },

  

  {
  slug: "win-boost",
  title: "Fortnite Win Boost",
  subtitle: "Choose wins, platform, and speed.",
  basePrice: 8.42,
  heroBadges: ["Any Level", "Fair Price", "Flexible"],
  rating: { score: 5.0, count: 1448 },
  ogImage: "/og/win.png",
  platforms: ["PC", "PS", "XBOX"],
  description: [
    "Select number of wins and platform.",
    "Flexible completion time.",
    "Secure trade method available.",
  ],
  variants: [
    {
      id: "win-boost",
      label: "Win Boost",
      amount: 1,
      price: 0,
      msrp: 0,
      deliveryTime: "1-6 hours",
      deliveryMethod: "Duo Queue",
    },
  ],
},

  
];


