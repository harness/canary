import { useState } from "preact/hooks";
import { Button } from "../components/Button";
import { HarnessMark } from "../components/HarnessMark";
import { ONBOARDING_SLIDES } from "./slides";

type Props = {
  onDone: () => void;
};

export function Onboarding({ onDone }: Props) {
  const [index, setIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[index]!;
  const last = index === ONBOARDING_SLIDES.length - 1;

  return (
    <div class="ds-onboarding" role="dialog" aria-label="Welcome to DS Contracts">
      <HarnessMark class="brand-mark ds-onboarding-mark" size={28} />
      <p class="subtitle" style={{ marginTop: 14 }}>
        DS Contracts
      </p>
      <h2>{slide.title}</h2>
      <p>{slide.body}</p>
      <div class="ds-onboarding-footer">
        <div class="ds-dots" aria-label={`Slide ${index + 1} of ${ONBOARDING_SLIDES.length}`}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <span
              key={i}
              class={i === index ? "ds-dot active" : "ds-dot"}
              aria-hidden="true"
            />
          ))}
        </div>
        <div class="ds-row" style={{ marginBottom: 0 }}>
          {index > 0 ? (
            <Button variant="ghost" onClick={() => setIndex((i) => i - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onDone}>
              Skip
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => {
              if (last) onDone();
              else setIndex((i) => i + 1);
            }}
          >
            {last ? "Get started" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
