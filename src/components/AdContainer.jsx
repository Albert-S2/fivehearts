"use client";

import { useEffect, useRef } from "react";

const AD_DIMENSIONS = {
  "half-page": { width: 300, height: 600 },
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
  const dimensions = getDimensions(format, style);

  useEffect(() => {
    if (isDevelopment || !adRef.current || !slotId) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense failed to load the ad slot.", error);
    }
  }, [isDevelopment, slotId]);

  return (
    <div
      aria-label={isDevelopment ? `Ad preview ${slotId}` : "Advertisement"}
      className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      role="complementary"
      style={{ ...dimensions, ...style }}
    >
      {isDevelopment ? (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-500/40 bg-slate-800/50 px-3 text-center text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
          <span>Ad preview</span>
          <span className="mt-2 max-w-full truncate text-[10px] font-medium tracking-normal text-slate-400">
            {slotId}
          </span>
        </div>
      ) : (
        <ins
          className="adsbygoogle block h-full w-full"
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
          data-ad-slot={slotId}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-full-width-responsive="true"
          ref={adRef}
          style={{ display: "block", height: "100%", width: "100%" }}
        />
      )}
    </div>
  );
}
