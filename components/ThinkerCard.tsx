"use client";

import { useState } from "react";
import type { Thinker, ThinkerResponse } from "@/types";

interface ThinkerCardProps {
  thinker: Thinker;
  response?: ThinkerResponse;
}

export function ThinkerCard({ thinker, response }: ThinkerCardProps) {
  const [showFrameworks, setShowFrameworks] = useState(false);

  const isLoading = !response || response.status === "streaming";
  const hasError = response?.status === "error";

  return (
    <div
      className="bg-[#F0E7D6] rounded-lg p-6 shadow-[0_2px_8px_rgba(61,47,35,0.06)]
                    animate-fadeIn"
    >
      <div className="mb-4">
        <h3 className="font-serif text-xl text-[#3D2F23] font-medium">
          {thinker.name}
        </h3>
        <p className="text-sm text-[#7A6855] font-sans">{thinker.tagline}</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-4 bg-[#E5D9C3] rounded animate-pulse"
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </div>
      )}

      {hasError && (
        <p className="text-[#C97D60] font-sans text-sm">
          {response.error || "Something went wrong. Please try again."}
        </p>
      )}

      {response?.status === "done" && response.heuristics.length > 0 && (
        <ul className="space-y-3">
          {response.heuristics.map((h, i) => (
            <li
              key={i}
              className="font-serif text-[#3D2F23] leading-relaxed pl-4 border-l-2 border-[#D4A574]"
            >
              {h}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setShowFrameworks(!showFrameworks)}
        className="mt-4 text-xs text-[#7A6855] font-sans hover:text-[#C97D60] transition-colors"
      >
        {showFrameworks ? "Hide frameworks" : "Show frameworks"}
      </button>

      {showFrameworks && (
        <div className="mt-3 pt-3 border-t border-[#E5D9C3]">
          <ul className="space-y-2 text-sm text-[#7A6855] font-sans">
            {thinker.frameworks.map((f, i) => (
              <li key={i}>
                <span className="font-medium text-[#3D2F23]">{f.name}:</span>{" "}
                {f.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
