# Contributing to Ketikin Editor Core

First off, thank you for considering contributing to Ketikin Editor Core! It's people like you that make it a great tool for everyone.

## Getting Started

1. **Fork and Clone**: Fork this repository, then clone your fork locally.
   ```bash
   git clone <your-fork-url>
   cd ketikin-editor-core
   ```

2. **Install Dependencies**: We use `npm` for dependency management.
   ```bash
   npm install
   ```

3. **Run the Development Server**: Ensure everything works by starting the local dev server.
   ```bash
   npm run dev
   ```

## Branching Strategy

To keep the repository organized, please follow these branch naming conventions:
- `feature/your-feature-name` (for new features)
- `fix/your-fix-name` (for bug fixes)
- `docs/your-doc-update` (for documentation changes)

## Development Workflow

1. Create a new branch from `main`.
2. Make your changes in the new branch.
3. Keep your commits small and descriptive. 
4. Check that your changes build successfully:
   ```bash
   npm run build
   ```

## Code Guidelines

- **TypeScript**: We use TypeScript. Please avoid using `any` unless absolutely necessary and ensure your types are well-defined.
- **Components**: For React components, use functional components and hooks.
- **Formatting**: Please ensure your code is formatted properly and follows the existing style established in the codebase.
- **Canvas Rendering**: If you're modifying `RenderEngine` or layout systems, please test extensively to ensure performance doesn't regress and text metric calculations remain accurate across different fonts/sizes.

## Pull Request Process

1. Push your branch to your forked repository.
2. Open a Pull Request against the `main` branch of this repository.
3. Provide a clear and descriptive PR title and description.
4. If your PR fixes an open issue, please reference it in the description (e.g., "Fixes #123").
5. Wait for a review from the maintainers. We may leave feedback or request changes before merging.

## Reporting Bugs

If you find a bug, please create an issue with the following information:
1. A clear and descriptive title.
2. Steps to reproduce the bug.
3. Expected behavior vs. actual behavior.
4. Screenshots or console errors if applicable.

We appreciate all contributions, whether it's code, documentation, or simply reporting a bug!
