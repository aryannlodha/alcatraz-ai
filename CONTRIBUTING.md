# Contributing to Alcatraz AI

First off, thank you for considering contributing to Alcatraz AI! We welcome contributions from the community.

## Getting Started

### Fork and Clone
1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/alcatraz-ai.git
   cd alcatraz-ai
   ```

### Development Environment
This project uses `pnpm` for package management.

1. Install `pnpm` (if you haven't already):
   ```bash
   npm install -g pnpm
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Project Structure
Alcatraz AI is a monorepo structured as follows:
- `packages/contracts`: Shared types and interfaces.
- `packages/reasoning`: Core logic and reasoning engines.
- `services/analysis`: Backend analysis services.
- `apps/desktop`: The main desktop application.

To build the packages, run the following command within their respective directories:
```bash
# Example: Building contracts
cd packages/contracts
pnpm exec tsc
```

## Submitting Pull Requests
1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and ensure the project still builds.
3. Commit your changes with descriptive messages.
4. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request against the `main` branch of the original repository.

## Code Style
- **TypeScript**: We use strict TypeScript settings. Ensure all your code is strongly typed and passes compiler checks.
- **TailwindCSS**: For UI components, we use TailwindCSS. Follow the existing utility class patterns.

Thank you for your contributions!
