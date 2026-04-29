"use client";

import type { Thinker } from "@/types";

interface CouncilSelectorProps {
  thinkers: Thinker[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onAddThinker: () => void;
  disabled?: boolean;
}

export function CouncilSelector({
  thinkers,
  selectedIds,
  onToggle,
  onAddThinker,
  disabled,
}: CouncilSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {thinkers.map((thinker) => {
        const isSelected = selectedIds.includes(thinker.id);
        return (
          <button
            key={thinker.id}
            onClick={() => onToggle(thinker.id)}
            disabled={disabled}
            className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-200
                       ${
                         isSelected
                           ? "bg-[#C97D60] text-white"
                           : "bg-[#F0E7D6] text-[#3D2F23] hover:bg-[#E5D9C3]"
                       }
                       disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {thinker.name}
          </button>
        );
      })}
      <button
        onClick={onAddThinker}
        disabled={disabled}
        className="px-4 py-2 rounded-full text-sm font-sans border border-dashed border-[#7A6855]
                   text-[#7A6855] hover:border-[#C97D60] hover:text-[#C97D60] transition-all duration-200
                   disabled:opacity-60 disabled:cursor-not-allowed"
      >
        + Add thinker
      </button>
    </div>
  );
}
