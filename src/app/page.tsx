import Link from "next/link";
import { defaultLocale, locales } from "@/lib/i18n";

/**
 * `/` is a static entry point: a statically exported site has no server to
 * issue a redirect, so the browser is sent on in-page. Anyone arriving with a
 * Bengali-preferring browser stays on bn, everyone else is routed to en, and
 * the no-script case gets real links.
 */
const redirectScript = `
(function () {
  try {
    var supported = ${JSON.stringify(locales)};
    var stored = null;
    try { stored = localStorage.getItem("discounty.locale"); } catch (e) {}
    var wanted = stored && supported.indexOf(stored) > -1 ? stored : null;
    if (!wanted) {
      var langs = navigator.languages || [navigator.language || ""];
      for (var i = 0; i < langs.length; i++) {
        var code = String(langs[i]).toLowerCase().split("-")[0];
        if (supported.indexOf(code) > -1) { wanted = code; break; }
      }
    }
    location.replace("/discount.com/" + (wanted || "${defaultLocale}") + "/");
  } catch (e) {
    location.replace("/discount.com/${defaultLocale}/");
  }
})();
`;

export default function RootPage() {
  return (
    <main className="flex-1 grid place-items-center px-6 py-24 text-center">
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <div className="space-y-6">
        <p className="text-2xl font-black tracking-tight">
          Discounty<span className="text-brand-600">.</span>
        </p>
        <p className="muted text-sm">Choose a language — ভাষা বেছে নিন</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/bn/"
            className="rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
          >
            বাংলা
          </Link>
          <Link
            href="/en/"
            className="surface rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-[var(--surface-muted)]"
          >
            English
          </Link>
        </div>
      </div>
    </main>
  );
}
