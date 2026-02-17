export type Option = {
  text: string;
  points: number;
  rationale: string;
};

export type Question = {
  id: number;
  text: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "After seeing your profile for 5 seconds, what will someone feel?",
    options: [
      { text: "This person is exactly what I’m looking for", points: 20, rationale: "Clear niche + instant trust" },
      { text: "Seems knowledgeable, I need to explore more", points: 12, rationale: "Interest without decision" },
      { text: "Not sure what they actually do", points: 6, rationale: "Confusion kills conversion" },
      { text: "Just another creator / service provider", points: 0, rationale: "No differentiation" },
    ],
  },
  {
    id: 2,
    text: "How do people usually message you?",
    options: [
      { text: "I want to work only with you", points: 20, rationale: "Authority-driven demand" },
      { text: "Can you give me some advice?", points: 12, rationale: "Trust without buying intent" },
      { text: "What’s your price?", points: 6, rationale: "Commodity perception" },
      { text: "Can you give me a discount?", points: 0, rationale: "Low authority + price pressure" },
    ],
  },
  {
    id: 3,
    text: "What do you post the most online?",
    options: [
      { text: "Results and success stories", points: 20, rationale: "Outcome-based trust" },
      { text: "Client testimonials", points: 14, rationale: "Social proof works" },
      { text: "Tips and teaching content", points: 8, rationale: "Value without positioning" },
      { text: "Just posting regularly", points: 0, rationale: "Effort ≠ authority" },
    ],
  },
  {
    id: 4,
    text: "During sales calls, who is in control?",
    options: [
      { text: "I lead the call", points: 20, rationale: "Leadership = premium" },
      { text: "Both of us", points: 12, rationale: "Partial control" },
      { text: "Client controls the call", points: 6, rationale: "Authority gap" },
      { text: "I avoid sales calls", points: 0, rationale: "No control = no scale" },
    ],
  },
  {
    id: 5,
    text: "What’s stopping you from charging more than your revenue?",
    options: [
      { text: "I don’t know how to position myself", points: 14, rationale: "Awareness of the real issue" },
      { text: "I don’t attract premium clients", points: 8, rationale: "Symptom, not cause" },
      { text: "Too much competition", points: 6, rationale: "External blame" },
      { text: "People won’t pay that much", points: 0, rationale: "Market mistrust mindset" },
    ],
  },
];

export function calculateScore(answers: Record<number, number>): number {
  let totalScore = 0;
  QUESTIONS.forEach((q) => {
    const selectedOptionIndex = answers[q.id];
    if (selectedOptionIndex !== undefined && q.options[selectedOptionIndex]) {
      totalScore += q.options[selectedOptionIndex].points;
    }
  });
  return totalScore;
}

export function getAuthorityLevel(score: number): { level: string; message: string; cta: string } {
  if (score <= 40) {
    return {
      level: "Authority Blocked",
      message: "You’re skilled, but replaceable. The market doesn’t see enough reason to choose you.",
      cta: "Book Your Authority Mapping Call",
    };
  } else if (score <= 70) {
    return {
      level: "Authority Underpriced",
      message: "People trust you, but not enough to pay premium. One positioning shift can change your income.",
      cta: "Book Your Authority Mapping Call",
    };
  } else {
    return {
      level: "Authority Ready",
      message: "You’re already perceived as an expert. Now you need a system to scale demand and pricing.",
      cta: "Book Your Authority Mapping Call",
    };
  }
}
