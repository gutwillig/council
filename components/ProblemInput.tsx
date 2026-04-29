"use client";

interface ProblemInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProblemInput({ value, onChange, disabled }: ProblemInputProps) {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="What decision are you wrestling with?"
        className="w-full min-h-[160px] p-5 text-lg bg-[#F0E7D6] text-[#3D2F23] placeholder-[#7A6855]
                   rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#C97D60]/30
                   font-serif leading-relaxed disabled:opacity-60"
      />
    </div>
  );
}
