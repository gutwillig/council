import Anthropic from "@anthropic-ai/sdk";
import { DEFAULT_THINKERS } from "@/lib/thinkers";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompt";
import type { Thinker } from "@/types";

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { problem, thinkerIds, customThinkers = [] } = await request.json();

  if (!problem || !thinkerIds || thinkerIds.length === 0) {
    return Response.json(
      { error: "Problem and at least one thinker required" },
      { status: 400 }
    );
  }

  const allThinkers = [...DEFAULT_THINKERS, ...customThinkers];
  const selectedThinkers = thinkerIds
    .map((id: string) => allThinkers.find((t) => t.id === id))
    .filter(Boolean) as Thinker[];

  if (selectedThinkers.length === 0) {
    return Response.json({ error: "No valid thinkers found" }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const promises = selectedThinkers.map(async (thinker) => {
        try {
          const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: buildSystemPrompt(thinker),
            messages: [{ role: "user", content: buildUserPrompt(problem) }],
          });

          const content = message.content[0];
          if (content.type !== "text") {
            throw new Error("Unexpected response type");
          }

          let heuristics: string[];
          try {
            heuristics = JSON.parse(content.text);
          } catch {
            // If JSON parsing fails, try to extract from text
            const lines = content.text
              .split("\n")
              .filter((l) => l.trim())
              .map((l) => l.replace(/^[\d\-\.\*]+\s*/, "").trim());
            heuristics = lines.slice(0, 8);
          }

          const result = {
            thinkerId: thinker.id,
            heuristics,
            status: "done",
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
          );
        } catch (error) {
          const result = {
            thinkerId: thinker.id,
            heuristics: [],
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(result)}\n\n`)
          );
        }
      });

      await Promise.all(promises);
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
