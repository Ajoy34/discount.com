import { describe, expect, it } from "vitest";
import {
  composeRequest,
  contact,
  displayPhone,
  emailHref,
  mailHref,
  telHref,
  whatsappHref,
  type RequestDetails,
} from "@/lib/contact";

const labels = {
  heading: "New consultancy request from Discounty",
  name: "Name",
  shop: "Shop",
  phone: "Phone",
  service: "Service",
  message: "Details",
};

const full: RequestDetails = {
  name: "Karim Uddin",
  shop: "Karim Electronics",
  phone: "01812345678",
  service: "Website building",
  message: "Need a shop website.",
};

describe("contact details", () => {
  it("keeps the local, international and WhatsApp forms in step", () => {
    // A typo in one of these would silently send enquiries nowhere.
    expect(contact.phoneLocal).toMatch(/^01\d{9}$/);
    expect(contact.phoneIntl).toBe(`+880${contact.phoneLocal.slice(1)}`);
    expect(contact.whatsapp).toBe(`880${contact.phoneLocal.slice(1)}`);
    expect(contact.whatsapp).not.toContain("+");
  });

  it("uses a plausible email address", () => {
    expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
  });

  it("builds tel: and mailto: hrefs from those details", () => {
    expect(telHref).toBe(`tel:${contact.phoneIntl}`);
    expect(mailHref).toBe(`mailto:${contact.email}`);
  });
});

describe("displayPhone", () => {
  it("groups the number the way it is written locally", () => {
    expect(displayPhone("en")).toBe("01533-033515");
  });

  it("renders Bengali-Indic digits for the bn locale", () => {
    expect(displayPhone("bn")).toBe("০১৫৩৩-০৩৩৫১৫");
    expect(displayPhone("bn")).not.toMatch(/\d/);
  });
});

describe("composeRequest", () => {
  it("includes every supplied field under its label", () => {
    const body = composeRequest(full, labels);
    expect(body).toContain(labels.heading);
    expect(body).toContain("Name: Karim Uddin");
    expect(body).toContain("Shop: Karim Electronics");
    expect(body).toContain("Phone: 01812345678");
    expect(body).toContain("Service: Website building");
    expect(body).toContain("Need a shop website.");
  });

  it("omits the shop line when no shop was given", () => {
    const body = composeRequest({ ...full, shop: "   " }, labels);
    expect(body).not.toContain("Shop:");
    expect(body).toContain("Phone:");
  });

  it("omits the details block when no message was given", () => {
    const body = composeRequest({ ...full, message: "" }, labels);
    expect(body).not.toContain("Details:");
    expect(body.trimEnd()).toBe(body.trimEnd());
  });

  it("always keeps name, phone and service, which the team needs to reply", () => {
    const body = composeRequest({ ...full, shop: "", message: "" }, labels);
    expect(body).toContain("Name:");
    expect(body).toContain("Phone:");
    expect(body).toContain("Service:");
  });
});

describe("share links", () => {
  it("points WhatsApp at the configured number", () => {
    const href = whatsappHref("hello");
    expect(href.startsWith(`https://wa.me/${contact.whatsapp}?text=`)).toBe(true);
  });

  it("percent-encodes the body so newlines and Bengali survive", () => {
    const body = "ডিসকাউন্টি\nName: A&B";
    const href = whatsappHref(body);
    expect(href).not.toContain("\n");
    expect(href).toContain("%0A");
    expect(decodeURIComponent(href.split("text=")[1])).toBe(body);
  });

  it("builds a mailto with an encoded subject and body", () => {
    const href = emailHref("Consultancy request", "line one\nline two");
    expect(href.startsWith(`mailto:${contact.email}?subject=`)).toBe(true);
    expect(href).toContain("&body=");
    const [, query] = href.split("?");
    const params = new URLSearchParams(query);
    expect(params.get("subject")).toBe("Consultancy request");
    expect(params.get("body")).toBe("line one\nline two");
  });

  it("does not break on an ampersand in the body", () => {
    const href = emailHref("s", "Rice & Oil");
    const params = new URLSearchParams(href.split("?")[1]);
    expect(params.get("body")).toBe("Rice & Oil");
  });
});
