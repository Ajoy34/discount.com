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
    image: img("photo-1542838132"),
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
    image: img("photo-1586015555751"),
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
    image: img("photo-1519708227418"),
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
    image: img("photo-1540420773420"),
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
    image: img("photo-1581092160607"),
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
    image: img("photo-1456735190827"),
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
