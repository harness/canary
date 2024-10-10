# Gitness

Gitness is a modern React-based web application designed to help developers manage their Git repositories efficiently. It provides features like repository browsing, commit history visualization, branch management, and more. With a sleek user interface, Gitness simplifies version control management for teams and individual developers.

## Features

- **Repository Browsing**: Quickly navigate through repositories, branches, and commits.
- **Commit History**: Visualize commit history with detailed information and diffs.
- **Branch Management**: Easily create, delete, and switch between branches.

## Installation

To set up and run Gitness locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/harness/canary.git
   cd apps/gitness
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run application:**

   ```bash
   pnpm dev
   ```

4. **Docker Setup:**

   ```bash
   docker build -t <tag> .
   docker run -p 5678:8080 -e API_URL=http://localhost:3000 -n ui <tag>
   ```

   UI will be available at `http://localhost:5678`. This assumes the BE is running on `http://localhost:3000`.
