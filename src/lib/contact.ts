import type { Locale } from "./i18n";

/**
 * Single source of truth for how people reach Discounty. Changing a number or
 * address here updates the footer, the shop-owner CTA and the consultancy
 * request form together.
 */
export const contact = {
  email: "vertextai101@gmail.com",

  /** As dialled inside Bangladesh. */
  phoneLocal: "01533033515",

  /** E.164, for tel: links and WhatsApp. */
  phoneIntl: "+8801533033515",

  /** wa.me wants the number with no plus and no leading zero. */
  whatsapp: "8801533033515",
} as const;

export const telHref = `tel:${contact.phoneIntl}`;
export const mailHref = `mailto:${contact.email}`;

/** Bengali-Indic digits so the number reads naturally in the bn locale. */
const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function displayPhone(locale: Locale): string {
  // 01533-033515 groups the way a Bangladeshi number is usually written.
  const grouped = `${contact.phoneLocal.slice(0, 5)}-${contact.phoneLocal.slice(5)}`;
  if (locale !== "bn") return grouped;
  return grouped.replace(/\d/g, (d) => bnDigits[Number(d)]);
}

export interface RequestDetails {
  name: string;
  shop: string;
  phone: string;
  service: string;
  message: string;
}

/**
 * Builds the plain-text enquiry shared by both the WhatsApp and email routes,
 * so a request reads the same whichever button the person picks.
 */
export function composeRequest(
  details: RequestDetails,
  labels: {
    heading: string;
    name: string;
    shop: string;
    phone: string;
    service: string;
    message: string;
  },
): string {
  const lines = [
    labels.heading,
    "",
    `${labels.name}: ${details.name}`,
  ];

  if (details.shop.trim()) lines.push(`${labels.shop}: ${details.shop}`);
  lines.push(`${labels.phone}: ${details.phone}`);
  lines.push(`${labels.service}: ${details.service}`);

  if (details.message.trim()) {
    lines.push("", `${labels.message}:`, details.message.trim());
  }

  return lines.join("\n");
}

export function whatsappHref(body: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(body)}`;
}

export function emailHref(subject: string, body: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
