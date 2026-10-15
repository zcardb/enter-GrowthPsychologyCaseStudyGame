import type { CastMember, CharacterLook, Mood, Panel, Speaker } from "../types";

/** Panel shorthand: p("client", "worried", "台词", ["focusId"]) */
export const p = (speaker: Speaker, mood: Mood, text: string, focus?: string[]): Panel => ({
  speaker,
  mood,
  text,
  focus,
});

export const who = (name: string, role: string, look: CharacterLook): CastMember => ({ name, role, look });
