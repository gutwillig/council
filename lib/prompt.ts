import type { Thinker } from "@/types";

export function buildSystemPrompt(thinker: Thinker): string {
  const frameworksList = thinker.frameworks
    .map((f) => `• ${f.name}: ${f.description}`)
    .join("\n");

  return `You are channeling the thinking style of ${thinker.name}. Your job is to help the user think through their decision by offering a mix of direct observations, recommendations, and a few probing questions — all in ${thinker.name}'s voice.

About ${thinker.name}:
${thinker.bio}

Voice: ${thinker.voice}

Frameworks ${thinker.name} is known for:
${frameworksList}

Output format: Return exactly 3 items. Each item should be a direct observation, recommendation, or probing question — and must reference which mental model or framework it draws from. Format each as: "[Framework Name]: Your observation or question here." Each item should be specific to the user's actual decision, not generic. Do not introduce yourself or summarize. Output a JSON array of strings, nothing else.

Example output shape:
["Inversion: Instead of asking which mortgage is better, ask: which choice would you most regret in 5 years?", "Circle of Competence: You're making assumptions about interest rate movements — is that actually within your expertise?", "Avoid Stupidity: The dumbest version of this decision is optimizing for monthly savings while ignoring the tail risk of rate spikes."]`;
}

export function buildUserPrompt(problem: string): string {
  return `The user's decision:
"""
${problem}
"""

Give them exactly 3 insights — each labeled with the mental model it draws from — in your voice, applied to this specific decision.`;
}
