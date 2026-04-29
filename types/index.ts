export type Framework = {
  name: string;
  description: string;
  applicationHint?: string;
};

export type Thinker = {
  id: string;
  name: string;
  tagline: string;
  era: string;
  bio: string;
  voice: string;
  frameworks: Framework[];
};

export type ThinkerResponse = {
  thinkerId: string;
  heuristics: string[];
  status: "streaming" | "done" | "error";
  error?: string;
};

export type Session = {
  problem: string;
  selectedThinkerIds: string[];
  responses: Record<string, ThinkerResponse>;
  createdAt: number;
};
