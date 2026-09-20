import type { Locale, Messages } from "./i18n";

/** Message keys available inside the Consultancy namespace. */
type ConsultancyKey = keyof Messages["Consultancy"];

export type CategoryId =
  | "grocery"
  | "pharmacy"
  | "fish"
  | "vegetables"
  | "hardware"
  | "stationery"
  | "electronics"
  | "clothing";

export type ServiceId =
  | "freeDelivery"
  | "fridgeRent"
  | "freezerRent"
  | "bulkOrder"
  | "homeService";

export type AreaId = "mirpur" | "dhanmondi" | "uttara";

export interface Offer {
  id: number;
  shopId: number;
  titleEn: string;
  titleBn: string;
  discount: number;
  validUntil: string;
}

export interface ShopService {
  id: ServiceId;
  noteEn: string;
  noteBn: string;
}

export interface Shop {
  id: number;
  nameEn: string;
  nameBn: string;
  category: CategoryId;
  area: AreaId;
  addressEn: string;
  addressBn: string;
  descriptionEn: string;
  descriptionBn: string;
  phone: string;
  whatsapp: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  distanceMeters: number;
  verified: boolean;
  featured: boolean;
  openNow: boolean;
  hours: string;
  image: string;
  services: ShopService[];
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=800&h=500`;

export const areas: { id: AreaId; nameEn: string; nameBn: string }[] = [
  { id: "mirpur", nameEn: "Mirpur", nameBn: "মিরপুর" },
  { id: "dhanmondi", nameEn: "Dhanmondi", nameBn: "ধানমন্ডি" },
  { id: "uttara", nameEn: "Uttara", nameBn: "উত্তরা" },
];

export const categories: CategoryId[] = [
  "grocery",
  "pharmacy",
  "fish",
  "vegetables",
  "hardware",
  "stationery",
  "electronics",
  "clothing",
];

export const shops: Shop[] = [
  {
    id: 1,
    nameEn: "Rahim General Store",
    nameBn: "রহিম জেনারেল স্টোর",
    category: "grocery",
    area: "mirpur",
    addressEn: "Mirpur 10, Bus Stand, Dhaka",
    addressBn: "মিরপুর ১০, বাস স্ট্যান্ড, ঢাকা",
    descriptionEn: "Daily groceries and fresh essentials at wholesale prices.",
    descriptionBn: "প্রতিদিনের মুদি ও টাটকা পণ্য পাইকারি দামে।",
    phone: "+8801711000001",
    whatsapp: "8801711000001",
    lat: 23.8223,
    lng: 90.3665,
    rating: 4.8,
    reviewCount: 126,
    distanceMeters: 450,
    verified: true,
    featured: true,
    openNow: true,
    hours: "8:00 — 22:00",
    image: img("photo-1542838132-92c53300491e"),
    services: [
      {
        id: "freeDelivery",
        noteEn: "Free home delivery within 1.5km",
        noteBn: "১.৫ কিমির মধ্যে বিনামূল্যে হোম ডেলিভারি",
      },
      {
        id: "bulkOrder",
        noteEn: "Discount on wholesale bulk purchases",
        noteBn: "পাইকারি বাল্ক কেনাকাটায় ছাড়",
      },
    ],
  },
  {
    id: 2,
    nameEn: "Lazz Pharma Mirpur",
    nameBn: "লাজ ফার্মা মিরপুর",
    category: "pharmacy",
    area: "mirpur",
    addressEn: "Mirpur 11 Main Road, Dhaka",
    addressBn: "মিরপুর ১১ মেইন রোড, ঢাকা",
    descriptionEn: "24/7 Genuine medicines and healthcare products.",
    descriptionBn: "২৪/৭ আসল ওষুধ ও স্বাস্থ্যসেবা পণ্য।",
    phone: "+8801711000002",
    whatsapp: "8801711000002",
    lat: 23.828,
    lng: 90.364,
    rating: 4.9,
    reviewCount: 203,
    distanceMeters: 850,
    verified: true,
    featured: true,
    openNow: true,
    hours: "24 ঘন্টা",
    image: img("photo-1586015555751-63bb77f4322a"),
    services: [
      {
        id: "freeDelivery",
        noteEn: "Emergency medicine delivery",
        noteBn: "জরুরি ওষুধ ডেলিভারি",
      },
      {
        id: "homeService",
        noteEn: "Free blood pressure check",
        noteBn: "বিনামূল্যে রক্তচাপ পরীক্ষা",
      },
    ],
  },
  {
    id: 3,
    nameEn: "Bhai Bhai Fish Market",
    nameBn: "ভাই ভাই মাছ বাজার",
    category: "fish",
    area: "dhanmondi",
    addressEn: "Dhanmondi 27 Bazar, Dhaka",
    addressBn: "ধানমন্ডি ২৭ বাজার, ঢাকা",
    descriptionEn: "Fresh river and sea fish directly from Padma & Meghna.",
    descriptionBn: "পদ্মা ও মেঘনা থেকে সরাসরি টাটকা নদী ও সামুদ্রিক মাছ।",
    phone: "+8801711000003",
    whatsapp: "8801711000003",
    lat: 23.754,
    lng: 90.376,
    rating: 4.5,
    reviewCount: 88,
    distanceMeters: 1200,
    verified: true,
    featured: false,
    openNow: false,
    hours: "6:00 — 20:00",
    image: img("photo-1519708227418-c8fd9a32b7a2"),
    services: [
      {
        id: "freezerRent",
        noteEn: "Ice box packing for transport",
        noteBn: "পরিবহনের জন্য আইস বক্স প্যাকিং",
      },
    ],
  },
  {
    id: 4,
    nameEn: "Green Organic Vegetables",
    nameBn: "গ্রিন অর্গানিক সবজি দোকান",
    category: "vegetables",
    area: "uttara",
    addressEn: "Uttara Sector 3 Bazar, Dhaka",
    addressBn: "উত্তরা সেক্টর ৩ বাজার, ঢাকা",
    descriptionEn: "Directly sourced organic veggies from Bogra farms.",
    descriptionBn: "বগুড়ার খামার থেকে সরাসরি আনা অর্গানিক সবজি।",
    phone: "+8801711000004",
    whatsapp: "8801711000004",
    lat: 23.868,
    lng: 90.398,
    rating: 4.7,
    reviewCount: 64,
    distanceMeters: 1800,
    verified: true,
    featured: true,
    openNow: false,
    hours: "7:00 — 21:00",
    image: img("photo-1540420773420-3366772f4999"),
    services: [
      {
        id: "freeDelivery",
        noteEn: "Free morning delivery",
        noteBn: "সকালে বিনামূল্যে ডেলিভারি",
      },
    ],
  },
  {
    id: 5,
    nameEn: "Dhaka Hardware & Tools",
    nameBn: "ঢাকা হার্ডওয়্যার অ্যান্ড টুলস",
    category: "hardware",
    area: "dhanmondi",
    addressEn: "Dhanmondi 8/A, Dhaka",
    addressBn: "ধানমন্ডি ৮/এ, ঢাকা",
    descriptionEn:
      "All kinds of sanitary, electrical & building hardware supplies.",
    descriptionBn:
      "সব ধরনের স্যানিটারি, বৈদ্যুতিক ও নির্মাণ সামগ্রী।",
    phone: "+8801711000005",
    whatsapp: "8801711000005",
    lat: 23.746,
    lng: 90.375,
    rating: 4.4,
    reviewCount: 41,
    distanceMeters: 2100,
    verified: false,
    featured: false,
    openNow: false,
    hours: "9:00 — 20:00",
    image: img("photo-1581092160607-ee22621dd758"),
    services: [
      {
        id: "homeService",
        noteEn: "Plumbing & Electrician support",
        noteBn: "প্লাম্বিং ও ইলেকট্রিশিয়ান সহায়তা",
      },
    ],
  },
  {
    id: 6,
    nameEn: "Student Stationery & Print",
    nameBn: "স্টুডেন্ট স্টেশনারি ও প্রিন্ট",
    category: "stationery",
    area: "mirpur",
    addressEn: "Mirpur 2, Near City College, Dhaka",
    addressBn: "মিরপুর ২, সিটি কলেজের কাছে, ঢাকা",
    descriptionEn:
      "Books, notebooks, office stationery and high quality printing.",
    descriptionBn: "বই, খাতা, অফিস স্টেশনারি ও উন্নত মানের প্রিন্টিং।",
    phone: "+8801711000006",
    whatsapp: "8801711000006",
    lat: 23.808,
    lng: 90.361,
    rating: 4.6,
    reviewCount: 57,
    distanceMeters: 600,
    verified: true,
    featured: false,
    openNow: false,
    hours: "9:00 — 21:00",
    image: img("photo-1456735190827-d1262f71b8a3"),
    services: [],
  },
];

export const offers: Offer[] = [
  {
    id: 1,
    shopId: 1,
    titleEn: "Eid Special 10% Discount on Rice & Oil",
    titleBn: "ঈদ স্পেশাল চাল ও তেলে ১০% ছাড়",
    discount: 10,
    validUntil: "2026-12-31",
  },
  {
    id: 2,
    shopId: 2,
    titleEn: "5% Flat Discount on All Medicines",
    titleBn: "সব ওষুধে ফ্ল্যাট ৫% ছাড়",
    discount: 5,
    validUntil: "2026-12-31",
  },
  {
    id: 3,
    shopId: 3,
    titleEn: "15% Off on Fresh Hilsa Fish",
    titleBn: "টাটকা ইলিশ মাছে ১৫% ছাড়",
    discount: 15,
    validUntil: "2026-12-31",
  },
  {
    id: 4,
    shopId: 4,
    titleEn: "20% OFF Combo Veggie Basket",
    titleBn: "কম্বো সবজি বাস্কেটে ২০% ছাড়",
    discount: 20,
    validUntil: "2026-12-31",
  },
  {
    id: 5,
    shopId: 6,
    titleEn: "10% Discount on Bulk Photo Copies",
    titleBn: "বাল্ক ফটোকপিতে ১০% ছাড়",
    discount: 10,
    validUntil: "2026-12-31",
  },
];

export function getShop(id: number): Shop | undefined {
  return shops.find((s) => s.id === id);
}

export function offersForShop(id: number): Offer[] {
  return offers.filter((o) => o.shopId === id);
}

export function shopName(shop: Shop, locale: Locale): string {
  return locale === "bn" ? shop.nameBn : shop.nameEn;
}

export function shopAddress(shop: Shop, locale: Locale): string {
  return locale === "bn" ? shop.addressBn : shop.addressEn;
}

export function shopDescription(shop: Shop, locale: Locale): string {
  return locale === "bn" ? shop.descriptionBn : shop.descriptionEn;
}

export function offerTitle(offer: Offer, locale: Locale): string {
  return locale === "bn" ? offer.titleBn : offer.titleEn;
}

export function areaName(id: AreaId, locale: Locale): string {
  const a = areas.find((x) => x.id === id);
  if (!a) return id;
  return locale === "bn" ? a.nameBn : a.nameEn;
}

/* ------------------------------------------------------------------ */
/* Business consultancy                                                */
/* ------------------------------------------------------------------ */

export type ConsultancyServiceId =
  | "ad-creation"
  | "ai-ad"
  | "website"
  | "guide";

export interface ConsultancyService {
  id: ConsultancyServiceId;
  /** Message keys in the Consultancy namespace. */
  titleKey: ConsultancyKey;
  descKey: ConsultancyKey;
  featureKeys: ConsultancyKey[];
  icon: "megaphone" | "sparkles" | "globe" | "book";
  priceEn: string;
  priceBn: string;
  priceUnit: "oneTime" | "perMonth" | "free";
  accent: "orange" | "violet" | "sky" | "emerald";
  popular?: boolean;
}

export const consultancyServices: ConsultancyService[] = [
  {
    id: "ad-creation",
    titleKey: "adCreationTitle",
    descKey: "adCreationDesc",
    featureKeys: [
      "adCreationF1",
      "adCreationF2",
      "adCreationF3",
      "adCreationF4",
    ],
    icon: "megaphone",
    priceEn: "৳2,500",
    priceBn: "৳২,৫০০",
    priceUnit: "oneTime",
    accent: "orange",
  },
  {
    id: "ai-ad",
    titleKey: "aiAdTitle",
    descKey: "aiAdDesc",
    featureKeys: ["aiAdF1", "aiAdF2", "aiAdF3", "aiAdF4"],
    icon: "sparkles",
    priceEn: "৳500",
    priceBn: "৳৫০০",
    priceUnit: "perMonth",
    accent: "violet",
    popular: true,
  },
  {
    id: "website",
    titleKey: "websiteTitle",
    descKey: "websiteDesc",
    featureKeys: ["websiteF1", "websiteF2", "websiteF3", "websiteF4"],
    icon: "globe",
    priceEn: "৳7,000",
    priceBn: "৳৭,০০০",
    priceUnit: "oneTime",
    accent: "sky",
  },
  {
    id: "guide",
    titleKey: "guideTitle",
    descKey: "guideDesc",
    featureKeys: ["guideF1", "guideF2", "guideF3", "guideF4"],
    icon: "book",
    priceEn: "Free",
    priceBn: "বিনামূল্যে",
    priceUnit: "free",
    accent: "emerald",
  },
];

export function getConsultancyService(
  id: string,
): ConsultancyService | undefined {
  return consultancyServices.find((s) => s.id === id);
}

/* ------------------------------------------------------------------ */
/* Offer engagement: reviews, trust and trending                       */
/* ------------------------------------------------------------------ */

export interface Review {
  id: string;
  offerId: number;
  author: string;
  /** 1–5. */
  rating: number;
  body: string;
  /** ISO date. */
  postedAt: string;
  /** Reviewer says the discount was honoured as advertised. */
  honoured: boolean;
  helpful: number;
}

export interface OfferSignals {
  /** People who opened the offer in the last 30 days. */
  views: number;
  /** People who tapped call, WhatsApp or directions from it. */
  claims: number;
  /** Reviewers who confirmed the discount was real, over total who said. */
  confirmed: number;
  disputed: number;
  /** Saved for later — a softer signal than a claim. */
  saves: number;
}

/**
 * Seed reviews. A static export has nowhere to persist new ones, so anything
 * a visitor writes is kept in their own browser and merged on top of these.
 */
export const reviews: Review[] = [
  {
    id: "r1",
    offerId: 1,
    author: "Sumaiya A.",
    rating: 5,
    body: "Rice and oil both discounted exactly as advertised. Staff knew about the offer straight away.",
    postedAt: "2026-09-02",
    honoured: true,
    helpful: 14,
  },
  {
    id: "r2",
    offerId: 1,
    author: "Tanvir H.",
    rating: 4,
    body: "Good price but the 5kg pack was out of stock on Friday evening. Went back Saturday and got it.",
    postedAt: "2026-08-28",
    honoured: true,
    helpful: 6,
  },
  {
    id: "r3",
    offerId: 2,
    author: "Nusrat J.",
    rating: 5,
    body: "Flat 5% on everything including prescription medicine. They also checked my blood pressure free.",
    postedAt: "2026-09-10",
    honoured: true,
    helpful: 22,
  },
  {
    id: "r4",
    offerId: 3,
    author: "Rakib M.",
    rating: 3,
    body: "Hilsa was fresh but the discount only applied to the larger fish, which was not clear in the offer.",
    postedAt: "2026-09-05",
    honoured: false,
    helpful: 31,
  },
  {
    id: "r5",
    offerId: 4,
    author: "Farhana K.",
    rating: 5,
    body: "The combo basket is genuinely good value. Delivered in the morning as promised.",
    postedAt: "2026-09-12",
    honoured: true,
    helpful: 9,
  },
  {
    id: "r6",
    offerId: 5,
    author: "Imran S.",
    rating: 4,
    body: "Bulk photocopy rate is the cheapest near the college. Queue gets long around exam time.",
    postedAt: "2026-08-19",
    honoured: true,
    helpful: 4,
  },
];

const signals: Record<number, OfferSignals> = {
  1: { views: 3120, claims: 486, confirmed: 41, disputed: 2, saves: 210 },
  2: { views: 5410, claims: 902, confirmed: 78, disputed: 1, saves: 388 },
  3: { views: 2280, claims: 197, confirmed: 19, disputed: 7, saves: 96 },
  4: { views: 1870, claims: 341, confirmed: 33, disputed: 1, saves: 174 },
  5: { views: 940, claims: 118, confirmed: 12, disputed: 0, saves: 51 },
};

export function offerSignals(offerId: number): OfferSignals {
  return (
    signals[offerId] ?? {
      views: 0,
      claims: 0,
      confirmed: 0,
      disputed: 0,
      saves: 0,
    }
  );
}

export function reviewsForOffer(offerId: number): Review[] {
  return reviews.filter((r) => r.offerId === offerId);
}

export function getOffer(id: number): Offer | undefined {
  return offers.find((o) => o.id === id);
}

export function averageRating(offerId: number, extra: Review[] = []): number {
  const all = [...reviewsForOffer(offerId), ...extra];
  if (all.length === 0) return 0;
  return all.reduce((sum, r) => sum + r.rating, 0) / all.length;
}

/**
 * How well the advertised discount has held up in practice, as a percentage.
 * Offers nobody has vouched for yet sit at zero rather than a flattering 100.
 */
export function trustScore(offerId: number): number {
  const { confirmed, disputed } = offerSignals(offerId);
  const total = confirmed + disputed;
  if (total === 0) return 0;
  return Math.round((confirmed / total) * 100);
}

/**
 * Trending blends reach, intent and honesty so a heavily viewed offer that
 * people dispute cannot outrank a smaller one that reliably delivers.
 */
export function trendingScore(offerId: number): number {
  const s = offerSignals(offerId);
  const engagement = s.claims * 3 + s.saves * 2 + s.views * 0.1;
  const trust = trustScore(offerId) / 100;
  return Math.round(engagement * (0.4 + 0.6 * trust));
}

/* ------------------------------------------------------------------ */
/* Leaderboard: paid placement                                         */
/* ------------------------------------------------------------------ */

export interface LeaderboardEntry {
  shopId: number;
  /** Taka committed for this cycle. Ranking is highest bid first. */
  bid: number;
  /** Where the shop sat last cycle, for the movement indicator. */
  previousRank: number;
  sponsor?: string;
}

export const leaderboard: LeaderboardEntry[] = [
  { shopId: 2, bid: 12500, previousRank: 2 },
  { shopId: 4, bid: 9800, previousRank: 1 },
  { shopId: 1, bid: 7400, previousRank: 4 },
  { shopId: 6, bid: 5200, previousRank: 3 },
  { shopId: 3, bid: 3100, previousRank: 6 },
  { shopId: 5, bid: 1500, previousRank: 5 },
];

export interface RankedShop extends LeaderboardEntry {
  rank: number;
  shop: Shop;
  movement: number;
}

/** Highest bid first; ties fall back to rating so the order is stable. */
export function rankedLeaderboard(): RankedShop[] {
  return [...leaderboard]
    .sort((a, b) => {
      if (b.bid !== a.bid) return b.bid - a.bid;
      const sa = getShop(a.shopId)?.rating ?? 0;
      const sb = getShop(b.shopId)?.rating ?? 0;
      return sb - sa;
    })
    .flatMap((entry, i) => {
      const shop = getShop(entry.shopId);
      if (!shop) return [];
      return [
        {
          ...entry,
          shop,
          rank: i + 1,
          movement: entry.previousRank - (i + 1),
        },
      ];
    });
}

/** What it would cost to take the top spot. */
export function bidToBeat(): number {
  const top = rankedLeaderboard()[0];
  return top ? top.bid + 500 : 1000;
}
