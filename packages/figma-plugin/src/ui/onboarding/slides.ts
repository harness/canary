export type OnboardingSlide = {
  title: string;
  body: string;
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    title: "Check against the Canary catalog",
    body: "Run Check on a selection or the whole page. Shared props must match the catalog — anything else fails.",
  },
  {
    title: "Highlight Figma-only props",
    body: "Controls like icon on/off help on the canvas. They are not React props. Note those items for engineers.",
  },
  {
    title: "Missing from the catalog? Propose it",
    body: "Turns a validation failure into a proposal for the design system, which can Accept, Amend, Defer, or Reject.",
  },
];
