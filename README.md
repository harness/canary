# Canary

Welcome to the Harness Canary monorepo! This repository contains multiple projects for Harness' next generation Unified UI.

# Repository Structure

- [packages](./packages/): Contains projects for Harness next generation Unified UI projects. They are published as npm packages.
- [apps](./apps/): Contains deployable/executable standalone applications.

# Projects

- [@harnessio/canary](./packages/canary/) - Harness Canary UI components library built on top of [Radix UI](https://www.radix-ui.com/) and [ShadCN UI](https://ui.shadcn.com/).
- [@harnessio/views](./packages/views/) - Harness Unified UI View Fragments.

# Getting Started

## Prerequisites

Before getting started with this repository, ensure you have the following prerequisites:

**Node.js**: You'll need `Node` version `18.20.4` or newer.
We use `pnpm` to manage this monorepo. To install `pnpm`, visit the [pnpm installation page](https://pnpm.io/installation).

## Installation

To set up the necessary dependencies for this monorepo, follow these steps:

1. Clone this repository to your local machine.
2. Open your terminal and navigate to the root folder of the cloned repository.
3. Run the following command to install dependencies:

```sh
pnpm install
pnpm deps
```

## Building

To build all projects, execute the following command from the repository root folder:

```sh
pnpm build
```

Or you can build individual project by running `pnpm run build` from each project folder root folder.

## Publishing

To publish all packages, run:

```sh
pnpm publish:all
```

You can also publish individual packages by running `pnpm publish` from each project folder. Note that you'll need to authenticate youself with `npm` before publishing.

DO NOT publish packages using `npm`. Use `pnpm` instead.

## Note for Visual Studio Code Users

If you're using Visual Studio Code (VSCode) and encounter issues with package recognition or type definitions after rebuilding the workspace, follow these steps to resolve them:

1. Open VSCode.
2. Press `Cmd-Shift-P` to open the command palette.
3. Type `Reload Project` and select it from the list.

This process helps to resolve any issues related to package recognition and type checking.

If you have any questions or encounter any problems, please don't hesitate to reach out for assistance. Happy coding!

## License

Apache License 2.0, see [LICENSE](https://github.com/harness/gitness/blob/main/LICENSE).
