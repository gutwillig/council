"use client";

import { useState, useEffect } from "react";
import { ProblemInput } from "@/components/ProblemInput";
import { CouncilSelector } from "@/components/CouncilSelector";
import { ThinkerCard } from "@/components/ThinkerCard";
import { AddThinkerModal } from "@/components/AddThinkerModal";
import { DEFAULT_THINKERS } from "@/lib/thinkers";
import { getCustomThinkers, saveCustomThinker } from "@/lib/storage";
import type { Thinker, ThinkerResponse } from "@/types";

export default function Home() {
  const [problem, setProblem] = useState("");
  const [allThinkers, setAllThinkers] = useState<Thinker[]>(DEFAULT_THINKERS);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    DEFAULT_THINKERS.map((t) => t.id)
  );
  const [responses, setResponses] = useState<Record<string, ThinkerResponse>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const custom = getCustomThinkers();
    if (custom.length > 0) {
      setAllThinkers([...DEFAULT_THINKERS, ...custom]);
    }
  }, []);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddThinker = (thinker: Thinker) => {
    saveCustomThinker(thinker);
    setAllThinkers((prev) => [...prev, thinker]);
    setSelectedIds((prev) => [...prev, thinker.id]);
  };

  const handleConvene = async () => {
    if (!problem.trim() || selectedIds.length === 0) return;

    setIsLoading(true);
    setHasSubmitted(true);

    // Initialize responses for selected thinkers
    const initialResponses: Record<string, ThinkerResponse> = {};
    selectedIds.forEach((id) => {
      initialResponses[id] = {
        thinkerId: id,
        heuristics: [],
        status: "streaming",
      };
    });
    setResponses(initialResponses);

    try {
      const customThinkers = allThinkers.filter(
        (t) => !DEFAULT_THINKERS.find((d) => d.id === t.id)
      );

      const res = await fetch("/api/convene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem,
          thinkerIds: selectedIds,
          customThinkers,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to convene council");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const result = JSON.parse(data) as ThinkerResponse;
            setResponses((prev) => ({
              ...prev,
              [result.thinkerId]: result,
            }));
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } catch (error) {
      console.error("Convene error:", error);
      // Mark all as error
      setResponses((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id].status === "streaming") {
            updated[id] = {
              ...updated[id],
              status: "error",
              error: "Failed to get response",
            };
          }
        });
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedThinkers = allThinkers.filter((t) =>
    selectedIds.includes(t.id)
  );

  return (
    <div className="min-h-screen bg-[#F7F1E6]">
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-[#3D2F23] font-medium mb-3">
            Council
          </h1>
          <p className="text-[#7A6855] font-sans text-lg">
            Borrow the mental models of history's greatest thinkers for your hardest decisions.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <ProblemInput
            value={problem}
            onChange={setProblem}
            disabled={isLoading}
          />
        </div>

        {/* Council Selector */}
        <div className="mb-8">
          <CouncilSelector
            thinkers={allThinkers}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onAddThinker={() => setShowModal(true)}
            disabled={isLoading}
          />
        </div>

        {/* Convene Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleConvene}
            disabled={isLoading || !problem.trim() || selectedIds.length === 0}
            className="px-8 py-3 bg-[#C97D60] text-white font-sans text-lg rounded-lg
                       hover:bg-[#B86D50] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Convening..." : "Convene"}
          </button>
        </div>

        {/* Results Grid */}
        {hasSubmitted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedThinkers.map((thinker) => (
              <ThinkerCard
                key={thinker.id}
                thinker={thinker}
                response={responses[thinker.id]}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Thinker Modal */}
      <AddThinkerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddThinker}
      />
    </div>
  );
}
