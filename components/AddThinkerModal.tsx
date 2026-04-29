"use client";

import { useState } from "react";
import type { Thinker } from "@/types";

interface AddThinkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (thinker: Thinker) => void;
}

export function AddThinkerModal({
  isOpen,
  onClose,
  onSave,
}: AddThinkerModalProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [voice, setVoice] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const thinker: Thinker = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name: name.trim(),
      tagline: tagline.trim() || "Custom thinker",
      era: "Custom",
      bio: bio.trim() || `A custom thinker named ${name.trim()}.`,
      voice:
        voice.trim() ||
        "Thoughtful and direct. Applies their unique perspective to the problem at hand.",
      frameworks: [],
    };

    onSave(thinker);
    setName("");
    setTagline("");
    setBio("");
    setVoice("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-[#F7F1E6] rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="font-serif text-xl text-[#3D2F23] mb-4">
          Add a Thinker
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-sans text-[#7A6855] mb-1">
              Name <span className="text-[#C97D60]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Peter Thiel"
              className="w-full px-3 py-2 bg-[#F0E7D6] text-[#3D2F23] rounded
                         focus:outline-none focus:ring-2 focus:ring-[#C97D60]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-[#7A6855] mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., Contrarian questions, zero-to-one thinking."
              className="w-full px-3 py-2 bg-[#F0E7D6] text-[#3D2F23] rounded
                         focus:outline-none focus:ring-2 focus:ring-[#C97D60]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-[#7A6855] mb-1">
              Bio / Background
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="2-3 sentences about who they are and what they're known for."
              rows={3}
              className="w-full px-3 py-2 bg-[#F0E7D6] text-[#3D2F23] rounded resize-none
                         focus:outline-none focus:ring-2 focus:ring-[#C97D60]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-sans text-[#7A6855] mb-1">
              Voice / Style
            </label>
            <textarea
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              placeholder="How do they speak? What's their tone? What do they value?"
              rows={2}
              className="w-full px-3 py-2 bg-[#F0E7D6] text-[#3D2F23] rounded resize-none
                         focus:outline-none focus:ring-2 focus:ring-[#C97D60]/30"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-sans text-[#7A6855] hover:text-[#3D2F23] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-sans bg-[#C97D60] text-white rounded
                         hover:bg-[#B86D50] transition-colors disabled:opacity-50"
            >
              Add to Council
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
