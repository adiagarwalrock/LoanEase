# Contributing to LoanEase

Thank you for your interest in contributing to LoanEase! We welcome contributions from everyone.

## Code of Conduct

Be respectful, inclusive, and considerate in all interactions. We're here to build something great together.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/LoanEase.git
   cd LoanEase
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:9002/

5. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Tech Stack

- **Framework**: Vite + Vue 3 (Composition API)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-vue (Radix Vue primitives)
- **Icons**: lucide-vue-next
- **Validation**: Zod

### Code Style

- Use TypeScript for type safety
- Follow Vue 3 Composition API patterns with `<script setup>`
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Add comments for complex logic

### Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # shadcn-vue UI components
│   ├── LoanCalculator.vue
│   ├── LoanForm.vue
│   └── AmortizationDisplay.vue
├── lib/                # Utilities and business logic
│   ├── calculator.ts   # Loan calculation functions
│   ├── types.ts        # TypeScript types and Zod schemas
│   └── utils.ts        # Helper functions
├── App.vue             # Root component
└── main.ts             # Application entry point
```

### Making Changes

1. **Write clean code**: Follow existing patterns and conventions
2. **Test your changes**: Ensure the app works correctly
   ```bash
   npm run build  # Test production build
   ```
3. **Update documentation**: If you add features, update README.md
4. **Keep commits atomic**: One logical change per commit
5. **Write clear commit messages**:
   ```
   feat: add monthly payment breakdown chart
   fix: correct compound interest calculation
   docs: update README with new currency options
   ```

### Commit Message Format

Use conventional commits format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Submitting Changes

1. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Fill out the PR template completely
   - Link any related issues
   - Add screenshots for UI changes

3. **Respond to feedback**: Be open to suggestions and iterate on your PR

## What to Contribute

### Good First Issues

Look for issues labeled `good first issue` - these are great starting points!

### Ideas for Contributions

- **Features**: Extra payment calculations, loan comparison tools, export to Excel
- **UI/UX**: Improved mobile experience, dark mode, accessibility enhancements
- **Calculations**: New interest types, additional loan scenarios
- **Documentation**: Tutorials, API docs, inline code comments
- **Bug Fixes**: Check open issues or report new ones
- **Tests**: Unit tests, integration tests, E2E tests
- **Performance**: Bundle size optimization, render performance

### Not Sure What to Work On?

- Check the [Issues](https://github.com/adiagarwalrock/LoanEase/issues) page
- Ask in discussions or open an issue to propose your idea
- Look for TODO comments in the codebase

## Reporting Bugs

Found a bug? Please open an issue using the bug report template. Include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS)

## Requesting Features

Have an idea? Open an issue using the feature request template. Describe:
- The problem your feature solves
- Your proposed solution
- Why this would benefit LoanEase users

## Questions?

- Open a [discussion](https://github.com/adiagarwalrock/LoanEase/discussions)
- Comment on relevant issues
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to LoanEase!** Every contribution, no matter how small, helps make this tool better for students and users worldwide.
