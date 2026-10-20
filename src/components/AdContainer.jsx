"use client";

import { useEffect, useRef } from "react";

const AD_DIMENSIONS = {
  "half-page": { width: 300, height: 600 },
  sidebar: { width: 180, height: 300 },
  rectangle: { width: 300, height: 250 },
  anchor: { width: 728, height: 90 },
  mobile: { width: 320, height: 50 },
};

function getDimensions(format, style) {
  const preset = AD_DIMENSIONS[format];
  return {
    width: style?.width || preset?.width || "100%",
    minHeight: style?.minHeight || preset?.height || 90,
    height: style?.height || preset?.height,
  };
}

export default function AdContainer({
  slotId,
  format = "auto",
  style,
  className = "",
}) {
  const adRef = useRef(null);
  const isDevelopment = process.env.NODE_ENV === "development";
  const hasPublisherId = Boolean(process.env.NEXT_PUBLIC_ADSENSE_PUB_ID);
  const showPreview = isDevelopment || !hasPublisherId;
  const dimensions = getDimensions(format, style);

  useEffect(() => {
    if (showPreview || !adRef.current || !slotId) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense failed to load the ad slot.", error);
    }
  }, [showPreview, slotId]);

  return (
    <div
      aria-label={showPreview ? `Ad preview ${slotId}` : "Advertisement"}
      className={`relative z-20 flex shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-amber-500 bg-white shadow-inner shadow-amber-500/20 ${className}`}
      role="complementary"
      style={{ ...dimensions, ...style }}
    >
      {showPreview ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-white px-3 text-center text-xs font-black uppercase tracking-[0.16em] text-slate-900">
          <span>Ad preview</span>
          <span className="mt-2 max-w-full truncate text-[10px] font-bold tracking-normal text-slate-500">
            {slotId}
          </span>
        </div>
      ) : (
        <>
          <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-white/80 text-[10px] font-black uppercase tracking-[0.18em] text-slate-900">
            Advertisement
          </span>
          <ins
            className="adsbygoogle relative z-10 block h-full w-full"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
            data-ad-slot={slotId}
            data-ad-format={format === "auto" ? "auto" : undefined}
            data-full-width-responsive="true"
            ref={adRef}
            style={{ display: "block", height: "100%", width: "100%" }}
          />
        </>
      )}
    </div>
  );
}
