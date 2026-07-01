import { useState, useEffect } from "react";
import { useFlowCard, DualPaneStepper } from "@harnessio/ui/components";
import {
  StaticChoice,
  DynamicChoice,
  ConfigAction,
  LogOutput,
  Summary,
} from "./onboarding";

// === Choose Provider Card ===
export function ChooseProviderCard() {
  const { complete } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Choose code provider"
      description="Select where your source code is hosted"
    >
      <StaticChoice
        question="What version control system do you use?"
        options={[
          { id: "github", label: "GitHub", logo: "github" },
          { id: "ghe", label: "GitHub Enterprise", logo: "github" },
          { id: "gitlab", label: "GitLab", logo: "gitlab" },
          { id: "bitbucket", label: "Bitbucket", logo: "bitbucket" },
          { id: "azure", label: "Azure Repos", logo: "azure" },
          { id: "git", label: "Git", logo: "git" },
          { id: "harness-code", label: "Harness Code", logo: "harness" },
        ]}
        onSelect={(id) => {
          if (id === "harness-code") {
            complete({ provider: "harness-code" }, "repo-selection");
          } else if (id === "github") {
            complete({ provider: "github" }, "github-auth");
          } else if (id === "ghe") {
            complete({ provider: "ghe" }, "ghe-auth");
          } else if (id === "gitlab") {
            complete({ provider: "gitlab" }, "gitlab-auth");
          } else if (id === "bitbucket") {
            complete({ provider: "bitbucket" }, "bitbucket-auth");
          } else if (id === "azure") {
            complete({ provider: "azure" }, "azure-auth");
          } else if (id === "git") {
            complete({ provider: "git" }, "git-auth");
          }
        }}
      />
    </DualPaneStepper.Card>
  );
}

// === GitHub Auth Card ===
export function GithubAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with GitHub",
      description: "Connect via OAuth or Personal Access Token",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ authType: "oauth" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with GitHub"
      description="Connect via OAuth or Personal Access Token"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your GitHub account."
        actionLabel="Open GitHub Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === GitHub Enterprise Auth Card ===
export function GheAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with GitHub Enterprise",
      description: "Enter your GHE server URL and credentials",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ gheUrl: "ghe.example.com" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with GitHub Enterprise"
      description="Enter your GHE server URL and credentials"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your GitHub Enterprise server."
        actionLabel="Open GHE Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === GitLab Auth Card ===
export function GitlabAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with GitLab",
      description: "Connect via OAuth or Personal Access Token",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ authType: "token" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with GitLab"
      description="Connect via OAuth or Personal Access Token"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your GitLab account."
        actionLabel="Open GitLab Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Bitbucket Auth Card ===
export function BitbucketAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with Bitbucket",
      description: "Connect via OAuth or App Password",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ authType: "oauth" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with Bitbucket"
      description="Connect via OAuth or App Password"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your Bitbucket account."
        actionLabel="Open Bitbucket Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Azure Repos Auth Card ===
export function AzureAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with Azure Repos",
      description: "Enter your Azure DevOps organization and PAT",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ org: "my-org" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with Azure Repos"
      description="Enter your Azure DevOps organization and PAT"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your Azure DevOps organization."
        actionLabel="Open Azure Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Git Auth Card ===
export function GitAuthCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Authenticate with Git",
      description: "Enter your Git repository URL and credentials",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(
          () =>
            complete({
              repoUrl: "https://git.example.com/repo.git",
            }),
          1000,
        );
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Authenticate with Git"
      description="Enter your Git repository URL and credentials"
    >
      <ConfigAction
        description="Set up authentication to connect Harness to your Git repository."
        actionLabel="Open Git Auth"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Authentication failed. Please try again."
        successMessage={succeeded ? "Authentication successful." : undefined}
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Create Secret Card ===
export function CreateSecretCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ encrypting credentials...",
      "✓ credentials encrypted",
      "→ storing in secret manager...",
      "✓ secret created",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete({ secretRef: "git-secret-123" });
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 400);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Store credentials"
      description="Securely storing authentication credentials"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Create Connector Card ===
export function CreateConnectorCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Create Connector",
      description: "Configure your code repository connector",
    }).then((result) => {
      if (result.success) {
        setFailed(false);
        setSucceeded(true);
        setTimeout(() => complete({ connectorRef: "connector-123" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Create connector"
      description="Configure the connection to your provider"
    >
      <ConfigAction
        description="Configure your code repository connector to allow Harness to access your source code."
        actionLabel="Open Connector Setup"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Connector configuration failed. Please try again."
        successMessage={
          succeeded ? "Connector created successfully." : undefined
        }
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Delegate Check Card ===
export function DelegateCheckCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ checking for available delegates...",
      "→ scanning registered delegates...",
      "✗ no delegates found",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 500);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Checking delegate availability"
      description="Looking for available Harness Delegates"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Install Delegate Card ===
export function InstallDelegateCard() {
  const { status, complete, skip, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Install Delegate",
      description: "Set up a Harness Delegate in your environment",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ delegateType: "kubernetes" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Install a Delegate"
      description="Set up a Harness Delegate in your environment"
    >
      <ConfigAction
        description="A delegate is required to connect to your infrastructure securely. Skip if you already have one running."
        actionLabel="Install Delegate"
        onAction={handleOpenDrawer}
        onSkip={() => skip("scan-repo")}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Delegate installation failed. Please try again."
        successMessage={
          succeeded ? "Delegate installed successfully." : undefined
        }
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Verify Delegate Card ===
export function VerifyDelegateCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ waiting for delegate to connect...",
      "→ delegate heartbeat detected",
      "✓ delegate connected",
      "✓ delegate healthy",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 600);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Waiting for delegate"
      description="Verifying delegate connectivity"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Test Connection Card ===
export function TestConnectionCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ testing connection...",
      "✓ endpoint reachable",
      "✓ authentication valid",
      "✓ permissions verified",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 400);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Verify connection"
      description="Testing connectivity to your code provider"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Connection Failed Card ===
export function ConnectionFailedCard() {
  const { complete } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Connection failed"
      description="Unable to connect to your code provider"
    >
      <Summary
        actions={[
          {
            description: "Connection failed.",
            label: "Retry",
            onClick: () => complete(undefined, "choose-provider"),
            variant: "primary",
          },
          {
            description: "Try a different provider.",
            label: "Change Provider",
            onClick: () => complete(undefined, "choose-provider"),
          },
        ]}
      >
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-cn-2 text-sm">
            Connection test failed. Please check your credentials and network
            connectivity.
          </p>
        </div>
      </Summary>
    </DualPaneStepper.Card>
  );
}

// === Repo Selection Card ===
const mockRepos = [
  { id: "repo-1", name: "marketing-site" },
  { id: "repo-2", name: "petstore-backend" },
  { id: "repo-3", name: "infra-terraform" },
  { id: "repo-4", name: "mobile-ios" },
  { id: "repo-5", name: "auth-service" },
  { id: "repo-6", name: "data-pipeline" },
  { id: "repo-7", name: "design-system" },
  { id: "repo-8", name: "docs-site" },
  { id: "repo-9", name: "analytics-dashboard" },
];

export function RepoSelectionCard() {
  const { complete, skip } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Select a repository"
      description="Pick the repo Harness should build from"
    >
      <DynamicChoice
        items={mockRepos}
        suggestedItems={[{ id: "hello-world", name: "harness-hello-world" }]}
        onSelect={(id) => {
          const allRepos = [
            ...mockRepos,
            { id: "hello-world", name: "harness-hello-world" },
          ];
          const repo = allRepos.find((r) => r.id === id);
          complete({ repoId: id, repoName: repo?.name });
        }}
        helperText="Not sure which repo to start with? Use our hello world example for now."
        onSkip={() => skip()}
        skipLabel="Skip — use hello-world example"
      />
    </DualPaneStepper.Card>
  );
}

// === Choose Infra Card ===
export function ChooseInfraCard() {
  const { complete, skip } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Choose build infrastructure"
      description="Select where your builds will run"
    >
      <StaticChoice
        question="Where should Harness run your builds?"
        options={[
          { id: "cloud", label: "Harness Cloud", logo: "harness" },
          { id: "kubernetes", label: "Kubernetes", logo: "kubernetes" },
          { id: "docker", label: "Docker", logo: "docker" },
          { id: "vm", label: "Cloud VMs" },
        ]}
        onSelect={(id) => {
          if (id === "cloud") {
            complete({ infrastructure: "cloud" }, "scan-repo");
          } else if (id === "kubernetes") {
            complete({ infrastructure: "kubernetes" }, "k8s-connector");
          } else if (id === "docker") {
            complete({ infrastructure: "docker" }, "docker-setup");
          } else if (id === "vm") {
            complete({ infrastructure: "vm" }, "vm-setup");
          }
        }}
        onSkip={() => skip("scan-repo")}
        skipLabel="Skip — use Harness Cloud"
      />
    </DualPaneStepper.Card>
  );
}

// === K8s Connector Card ===
export function K8sConnectorCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Kubernetes Cluster",
      description: "Enter your cluster endpoint and credentials",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(
          () =>
            complete({
              clusterEndpoint: "https://k8s.example.com",
            }),
          1000,
        );
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Configure Kubernetes cluster"
      description="Enter your cluster endpoint and credentials"
    >
      <ConfigAction
        description="Connect your Kubernetes cluster to run builds in your own infrastructure."
        actionLabel="Configure Cluster"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Cluster configuration failed. Please try again."
        successMessage={
          succeeded ? "Cluster configured successfully." : undefined
        }
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === K8s Test Card ===
export function K8sTestCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ testing cluster connection...",
      "✓ cluster reachable",
      "✓ authentication verified",
      "→ checking namespace permissions...",
      "✓ namespace access confirmed",
      "✓ cluster ready",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 400);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Testing cluster connection"
      description="Verifying Kubernetes cluster connectivity"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Docker Setup Card ===
export function DockerSetupCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Docker Runner Setup",
      description: "Install and configure the Docker build runner",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ infraType: "docker" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Set up Docker runner"
      description="Install and configure the Docker build runner"
    >
      <ConfigAction
        description="Install and configure the Docker build runner to execute builds in containers."
        actionLabel="Configure Docker"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="Docker setup failed. Please try again."
        successMessage={
          succeeded ? "Docker runner configured successfully." : undefined
        }
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === VM Setup Card ===
export function VmSetupCard() {
  const { status, complete, error, openDrawer } = useFlowCard();
  const [failed, setFailed] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    if (status === "active") {
      setFailed(false);
      setSucceeded(false);
    }
  }, [status]);

  const handleOpenDrawer = () => {
    openDrawer("config", {
      title: "Cloud VM Configuration",
      description: "Set up your AWS/GCP/Azure VM infrastructure",
    }).then((result) => {
      if (result.success) {
        setSucceeded(true);
        setTimeout(() => complete({ infraType: "vm" }), 1000);
      } else {
        setFailed(true);
        error();
      }
    });
  };

  return (
    <DualPaneStepper.Card
      title="Configure cloud VMs"
      description="Set up your AWS/GCP/Azure VM infrastructure"
    >
      <ConfigAction
        description="Set up cloud virtual machines to run builds in your cloud provider."
        actionLabel="Configure VMs"
        onAction={handleOpenDrawer}
        errorState={failed ? "recoverable" : undefined}
        errorMessage="VM configuration failed. Please try again."
        successMessage={
          succeeded ? "VM infrastructure configured successfully." : undefined
        }
        onRetry={handleOpenDrawer}
      />
    </DualPaneStepper.Card>
  );
}

// === Scan Repo Card ===
export function ScanRepoCard() {
  const { state, status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const repoName = (state.repoName as string) || "repository";
    const language = (state.language as string) || "TypeScript";

    const sequence = [
      `→ cloning ${repoName}...`,
      "✓ repository cloned",
      `→ analyzing ${language} project...`,
      "✓ build configuration detected",
      "→ scanning dependencies...",
      "✓ dependencies analyzed",
      "→ detecting test framework...",
      "✓ test configuration found",
      "→ generating pipeline...",
      "✓ pipeline generated",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete({
            pipelineYaml: generatePipelineYAML(repoName, language),
          });
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 350);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Analyzing your repository"
      description="Scanning repository structure and generating pipeline"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Review Pipeline Card ===
export function ReviewPipelineCard() {
  const { state, complete, skip } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Review pipeline configuration"
      description="Our agent will create a pipeline from your repo"
    >
      <Summary
        logs={[
          "✓ Configured Build and Test stages",
          "✓ Added 6 steps",
          "✓ Triggers: Push, PR",
          "✓ Completed pipeline.yaml",
        ]}
        filename="pipeline.yaml"
        yaml={(state.pipelineYaml as string) || "# Loading pipeline..."}
        actions={[
          {
            description: "You created your first pipeline. Let's run it.",
            label: "Run Pipeline",
            onClick: () => complete(),
            variant: "primary",
          },
          {
            description: "Skip review and save as-is.",
            label: "Skip Review",
            onClick: () => skip(),
          },
        ]}
      />
    </DualPaneStepper.Card>
  );
}

// === Commit Pipeline Card ===
export function CommitPipelineCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ saving pipeline configuration...",
      "✓ pipeline saved",
      "→ creating webhook...",
      "✓ webhook configured",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 500);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Saving pipeline"
      description="Committing pipeline configuration"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Trigger Build Card ===
export function TriggerBuildCard() {
  const { status, complete } = useFlowCard();
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (status !== "active") return;
    setLogs([]);
    setDone(false);
    let cancelled = false;

    const sequence = [
      "→ triggering first build...",
      "✓ build started",
      "→ initializing build environment...",
      "✓ environment ready",
      "→ cloning repository...",
      "✓ code cloned",
      "→ running build steps...",
      "✓ build completed successfully",
      "→ running tests...",
      "✓ all tests passed",
    ];
    let i = 0;
    const tick = () => {
      if (cancelled || i >= sequence.length) {
        if (!cancelled) {
          setDone(true);
          complete();
        }
        return;
      }
      setLogs((prev) => [...prev, sequence[i++]]);
      setTimeout(tick, 450);
    };
    tick();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Running first build"
      description="Executing your first CI build"
    >
      <LogOutput logs={logs} done={done} />
    </DualPaneStepper.Card>
  );
}

// === Build Failed Card ===
export function BuildFailedCard() {
  const { complete } = useFlowCard();

  return (
    <DualPaneStepper.Card
      title="Build failed"
      description="Your first build encountered an error"
    >
      <Summary
        actions={[
          {
            description: "Review and fix your pipeline configuration.",
            label: "Review Pipeline",
            onClick: () => complete(undefined, "review-pipeline"),
            variant: "primary",
          },
          {
            description: "Check build logs for details.",
            label: "View Logs",
            onClick: () => {},
          },
        ]}
      >
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-cn-2 text-sm">
            Build failed during test execution. Review the pipeline
            configuration or check build logs for details.
          </p>
        </div>
      </Summary>
    </DualPaneStepper.Card>
  );
}

// === Onboarding Complete Card ===
export function OnboardingCompleteCard() {
  const { status, complete } = useFlowCard();

  useEffect(() => {
    if (status !== "active") return;
    complete();
  }, [status]);

  return (
    <DualPaneStepper.Card
      title="Pipeline ready!"
      description="Your CI pipeline is configured and running"
    >
      <Summary
        logs={[
          "✓ Pipeline created successfully",
          "✓ First build completed",
          "✓ All checks passed",
        ]}
        actions={[
          {
            description:
              "You created your first pipeline. Let's go see it in Pipeline Studio.",
            label: "View Pipeline",
            onClick: () => {},
          },
        ]}
      />
    </DualPaneStepper.Card>
  );
}

// === Helper ===
function generatePipelineYAML(repoName: string, language: string): string {
  const buildCmd =
    language === "Go"
      ? "go build ./..."
      : language === "Python"
        ? "pip install -r requirements.txt"
        : "npm ci";
  const testCmd =
    language === "Go"
      ? "go test ./..."
      : language === "Python"
        ? "pytest"
        : "npm test";
  const lintCmd =
    language === "Go"
      ? "golangci-lint run"
      : language === "Python"
        ? "flake8"
        : "npm run lint";

  return `pipeline:
  name: ${repoName}
  identifier: ${repoName.replace(/-/g, "_")}
  projectIdentifier: default
  orgIdentifier: default
  properties:
    ci:
      codebase:
        repoName: ${repoName}
        build: <+input>
  stages:
    - stage:
        name: Build and Test
        identifier: build_and_test
        type: CI
        spec:
          cloneCodebase: true
          execution:
            steps:
              - step:
                  type: Run
                  name: Install Dependencies
                  identifier: install
                  spec:
                    shell: Bash
                    command: ${buildCmd}
              - step:
                  type: Run
                  name: Lint
                  identifier: lint
                  spec:
                    shell: Bash
                    command: ${lintCmd}
              - step:
                  type: Run
                  name: Test
                  identifier: test
                  spec:
                    shell: Bash
                    command: ${testCmd}
                    reports:
                      type: JUnit
                      spec:
                        paths:
                          - reports/junit.xml
          platform:
            os: Linux
            arch: Amd64
          runtime:
            type: Cloud
            spec: {}`;
}
