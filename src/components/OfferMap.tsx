"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
}

/**
 * OpenStreetMap through Leaflet: no API key, no account, and no tile billing,
 * which matters for a site that deploys as static files.
 *
 * Leaflet touches `window` on import, so the module is loaded lazily inside an
 * effect rather than at the top level, keeping the static export buildable.
 */
export default function OfferMap({
  points,
  height = "24rem",
  zoom = 12,
  emptyLabel,
}: {
  points: MapPoint[];
  height?: string;
  zoom?: number;
  emptyLabel: string;
}) {
  const container = useRef<HTMLDivElement | null>(null);
  const instance = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    const node = container.current;
    if (!node || points.length === 0) return;

    (async () => {
      const mod = await import("leaflet");
      const L = ((mod as { default?: typeof mod }).default ?? mod);
      if (cancelled || !container.current) return;

      // Leaflet's default marker images resolve to paths that do not survive a
      // static export, so markers are drawn as styled div icons instead.
      const map = L.map(node, {
        scrollWheelZoom: false,
        attributionControl: true,
      });
      instance.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const bounds: [number, number][] = [];

      for (const point of points) {
        bounds.push([point.lat, point.lng]);

        const icon = L.divIcon({
          className: "",
          html: `<span class="discounty-pin">${
            point.badge ? `<b>${point.badge}</b>` : ""
          }</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -32],
        });

        L.marker([point.lat, point.lng], { icon, title: point.title })
          .addTo(map)
          .bindPopup(
            `<strong>${point.title}</strong><br>${point.subtitle}<br>` +
              `<a href="${point.href}">&rarr;</a>`,
          );
      }

      if (bounds.length === 1) {
        map.setView(bounds[0], zoom + 2);
      } else {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    })();

    return () => {
      cancelled = true;
      const map = instance.current as { remove?: () => void } | null;
      if (map && typeof map.remove === "function") map.remove();
      instance.current = null;
    };
  }, [points, zoom]);

  if (points.length === 0) {
    return (
      <p className="surface grid place-items-center rounded-3xl px-6 py-16 text-center text-sm muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div
      ref={container}
      style={{ height }}
      className="w-full overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-muted)]"
      role="application"
      aria-label="Map"
    />
  );
}
