import { useState } from "react";

import {
  Button,
  ButtonLayout,
  CardSelect,
  Radio,
  SinglePaneStepperV2,
  Textarea,
  TextInput,
  TooltipProvider,
  useEngineContext,
  useFlowCard,
} from "@harnessio/ui/components";
import type { FlowConfig } from "@harnessio/ui/components";

function savedValue(value: unknown, fallback: string) {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

// Go-back rewinds engine state to the previous step and remounts this card.
// The saved answer lives on this step's history snapshot, so read that first.
function useSavedField(stepId: string, key: string, fallback: string) {
  const { state } = useFlowCard<Record<string, unknown>>();
  const { cardHistory } = useEngineContext();
  const snapshot = cardHistory.find(
    (entry) => entry.stepId === stepId,
  )?.stateSnapshot;
  return savedValue(snapshot?.[key] ?? state[key], fallback);
}

function GoalCard() {
  const { complete } = useFlowCard<{ goal?: string; answer?: string }>();
  const saved = useSavedField(
    "goal",
    "goal",
    "Switch a Sign Up button from blue to green, or change its copy, for a subset of users.",
  );
  const [value, setValue] = useState(saved);

  return (
    <SinglePaneStepperV2.Card
      title="What do you want your first flag to do?"
      description="In a sentence or two, describe what functionality you want your first feature flag to control."
    >
      <Textarea
        name="flag-goal"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
      />
      <ButtonLayout.Root>
        <Button
          disabled={!value.trim()}
          onClick={() => complete({ goal: value, answer: value })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function IdentityCard() {
  const { complete } = useFlowCard<{
    identity?: string;
    answer?: string;
  }>();
  const saved = useSavedField("identity", "identity", "user-id");
  const [value, setValue] = useState(saved);
  const labels: Record<string, string> = {
    anonymous: "Anonymous visitors",
    "user-id": "Logged-in users by ID",
  };

  return (
    <SinglePaneStepperV2.Card
      title="How should we identify users?"
      description="Choose the identifier Harness will use when evaluating this flag."
    >
      <CardSelect.Root
        type="single"
        value={value}
        onValueChange={(next: unknown) => setValue(String(next))}
      >
        <CardSelect.Item value="anonymous">Anonymous visitors</CardSelect.Item>
        <CardSelect.Item value="user-id">Logged-in users by ID</CardSelect.Item>
      </CardSelect.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ identity: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function AudienceCard() {
  const { complete } = useFlowCard<{
    audience?: string;
    answer?: string;
  }>();
  const saved = useSavedField("audience", "audience", "subset");
  const [value, setValue] = useState(saved);
  const labels: Record<string, string> = {
    everyone: "Everyone",
    subset: "A subset of users",
    specific: "Specific targets only",
  };

  return (
    <SinglePaneStepperV2.Card
      title="Who should see the new experience?"
      description="This can be changed later without a deploy."
    >
      <Radio.Root value={value} onValueChange={setValue}>
        <Radio.Item value="everyone" label="Everyone" />
        <Radio.Item value="subset" label="A subset of users" />
        <Radio.Item value="specific" label="Specific targets only" />
      </Radio.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ audience: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function NameCard() {
  const { complete } = useFlowCard<{
    flagName?: string;
    answer?: string;
  }>();
  const saved = useSavedField("flagName", "flagName", "signup-button-color");
  const [value, setValue] = useState(saved);

  return (
    <SinglePaneStepperV2.Card
      title="What should we name this flag?"
      description="Use a stable identifier. This becomes the flag key in code."
    >
      <TextInput
        name="flag-name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <ButtonLayout.Root>
        <Button
          disabled={!value.trim()}
          onClick={() => complete({ flagName: value, answer: value })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function EnvironmentCard() {
  const { complete } = useFlowCard<{
    environment?: string;
    answer?: string;
  }>();
  const saved = useSavedField("environment", "environment", "qa");
  const [value, setValue] = useState(saved);
  const labels: Record<string, string> = {
    qa: "QA",
    staging: "Staging",
    production: "Production",
  };

  return (
    <SinglePaneStepperV2.Card
      title="Where will this flag live first?"
      description="Start somewhere safe, then promote the same flag key."
    >
      <Radio.Root value={value} onValueChange={setValue}>
        <Radio.Item value="qa" label="QA" />
        <Radio.Item value="staging" label="Staging" />
        <Radio.Item value="production" label="Production" />
      </Radio.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() =>
            complete({ environment: value, answer: labels[value] })
          }
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function RolloutCard() {
  const { complete } = useFlowCard<{
    rollout?: string;
    answer?: string;
  }>();
  const saved = useSavedField("rollout", "rollout", "percentage");
  const [value, setValue] = useState(saved);
  const labels: Record<string, string> = {
    off: "Serve the default variation",
    percentage: "Roll out to 10% of users",
    on: "Serve the new variation to everyone",
  };

  return (
    <SinglePaneStepperV2.Card
      title="How should we roll it out?"
      description="Choose the first serving rule. You can change this after create."
    >
      <CardSelect.Root
        type="single"
        value={value}
        onValueChange={(next: unknown) => setValue(String(next))}
      >
        <CardSelect.Item value="off">
          Serve the default variation
        </CardSelect.Item>
        <CardSelect.Item value="percentage">
          Roll out to 10% of users
        </CardSelect.Item>
        <CardSelect.Item value="on">
          Serve the new variation to everyone
        </CardSelect.Item>
      </CardSelect.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ rollout: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function ReviewCard() {
  const { state, complete } = useFlowCard<{
    flagName?: string;
    environment?: string;
    answer?: string;
  }>();
  const summary = `Create ${state.flagName ?? "this flag"} in ${state.environment ?? "QA"}`;

  return (
    <SinglePaneStepperV2.Card
      title="Ready to create this flag?"
      description="Review the conversation above, then create the flag."
    >
      <ButtonLayout.Root>
        <Button onClick={() => complete({ answer: summary })}>
          Create flag
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

const flagOnboardingFlow: FlowConfig = {
  steps: {
    goal: {
      title: "What do you want your first flag to do?",
      component: GoalCard,
      next: "identity",
    },
    identity: {
      title: "How should we identify users?",
      component: IdentityCard,
      next: "audience",
    },
    audience: {
      title: "Who should see the new experience?",
      component: AudienceCard,
      next: "name",
    },
    name: {
      title: "What should we name this flag?",
      component: NameCard,
      next: "environment",
    },
    environment: {
      title: "Where will this flag live first?",
      component: EnvironmentCard,
      next: "rollout",
    },
    rollout: {
      title: "How should we roll it out?",
      component: RolloutCard,
      next: "review",
    },
    review: {
      title: "Ready to create this flag?",
      component: ReviewCard,
    },
  },
  initialStep: "goal",
};

export function FlagOnboardingDemo() {
  const [showInactiveSteps, setShowInactiveSteps] = useState(true);

  return (
    <div className="not-content my-6">
      <Radio.Root
        value={showInactiveSteps ? "show" : "hide"}
        onValueChange={(next) => setShowInactiveSteps(next === "show")}
        className="mb-cn-md auto-cols-max grid-flow-col items-center"
        aria-label="Inactive steps"
      >
        <Radio.Item value="show" label="Show inactive steps" />
        <Radio.Item value="hide" label="Hide inactive steps" />
      </Radio.Root>
      <div className="border-cn-2 bg-cn-2 h-[720px] overflow-hidden rounded-lg border">
        <div className="not-content h-full">
          <TooltipProvider>
            <SinglePaneStepperV2.Root
              flow={flagOnboardingFlow}
              contentTitle="Create your first feature flag"
              contentSubtitle="Answer each question. Completed answers stay in the thread as chat messages."
              showRootHeader={false}
              showInactiveSteps={showInactiveSteps}
            />
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
