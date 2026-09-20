import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getTranslator, isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const active = locale as Locale;
  const nav = getTranslator(active, "Navigation");
  const footer = getTranslator(active, "Footer");
  const index = getTranslator(active, "Index");

  const navStrings = {
    home: nav("home"),
    search: nav("search"),
    offers: nav("offers"),
    dashboard: nav("dashboard"),
    consultancy: nav("consultancy"),
    consultancyShort: nav("consultancyShort"),
    login: nav("login"),
    menu: nav("menu"),
    closeMenu: nav("closeMenu"),
    skipToContent: nav("skipToContent"),
    title: index("title"),
    searchPlaceholder: index("searchPlaceholder"),
  };

  const footerStrings = {
    tagline: footer("tagline"),
    forCustomers: footer("forCustomers"),
    forBusiness: footer("forBusiness"),
    company: footer("company"),
    about: footer("about"),
    contact: footer("contact"),
    privacy: footer("privacy"),
    terms: footer("terms"),
    rights: footer("rights"),
    language: footer("language"),
    contactHeading: footer("contactHeading"),
    title: index("title"),
    home: nav("home"),
    search: nav("search"),
    offers: nav("offers"),
    consultancy: nav("consultancy"),
    dashboard: nav("dashboard"),
  };

  return (
    <>
      {/* Keeps the document language correct without a per-locale root layout. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(active)};`,
        }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {navStrings.skipToContent}
      </a>
      <Header locale={active} t={navStrings} />
      <main id="main" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer locale={active} t={footerStrings} />
      <BottomNav locale={active} t={navStrings} />
    </>
  );
}
