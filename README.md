# LoanEase

> A clean, fast loan calculator built for students to understand amortization schedules and payment breakdowns.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Made with Vue](https://img.shields.io/badge/Made%20with-Vue.js-42b883)](https://vuejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🎯 Overview

LoanEase is a lightweight web application designed to calculate loan details with precision. Input your loan parameters (principal, interest rate, duration), select interest types (simple/compound), and view detailed amortization schedules with monthly or yearly breakdowns.

**Live Demo**: [Coming Soon]

## ✨ Features

- **Loan Calculator**: Input principal, interest rate, and loan term
- **Interest Types**: Support for both Simple and Compound interest
- **Amortization Schedule**: Detailed payment breakdown over time
- **Monthly/Yearly Views**: Toggle between different schedule views
- **Payment Tracking**: Mark payments as paid and track progress
- **Multiple Currencies**: USD, EUR, GBP, JPY, INR support
- **Personal Notes**: Add comments to your loan reports
- **Print/PDF Export**: Save your amortization schedules
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Fast Performance**: Lightning-fast calculations with optimized rendering

## 🚀 Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [Vue 3](https://vuejs.org/) (Composition API)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-vue](https://www.shadcn-vue.com/) (built on Radix Vue primitives)
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Analytics**: Vercel Analytics & Speed Insights

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # shadcn-vue UI components
│   ├── LoanCalculator.vue
│   ├── LoanForm.vue
│   └── AmortizationDisplay.vue
├── lib/                # Core business logic
│   ├── calculator.ts   # Loan calculation functions
│   ├── types.ts        # TypeScript types and Zod schemas
│   └── utils.ts        # Helper functions
├── App.vue             # Root component
└── main.ts             # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adiagarwalrock/LoanEase.git
   cd LoanEase
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:9002
   ```

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🎨 Design System

- **Primary Color**: Soft Indigo (`#6366F1`)
- **Background**: Aurora gradient with mesh overlay
- **Surface**: White cards with subtle shadows
- **Typography**: 'Inter' font family
- **Layout**: Two-column responsive grid

## 🤝 Contributing

We welcome contributions from everyone! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

**Quick Start:**
1. Read our [Contributing Guide](CONTRIBUTING.md)
2. Check out [open issues](https://github.com/adiagarwalrock/LoanEase/issues)
3. Look for issues tagged `good first issue`
4. Fork the repo and create a pull request

### Ways to Contribute

- 🐛 Report bugs via [bug reports](https://github.com/adiagarwalrock/LoanEase/issues/new?template=bug_report.md)
- 💡 Suggest features via [feature requests](https://github.com/adiagarwalrock/LoanEase/issues/new?template=feature_request.md)
- 📝 Improve documentation
- 🎨 Enhance UI/UX
- ✅ Add tests
- 🔧 Fix issues

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for students learning about loans and financial planning
- UI components from [shadcn-vue](https://www.shadcn-vue.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/adiagarwalrock/LoanEase/issues)
- **Discussions**: [GitHub Discussions](https://github.com/adiagarwalrock/LoanEase/discussions)
- **Repository**: [github.com/adiagarwalrock/LoanEase](https://github.com/adiagarwalrock/LoanEase)

---

**Made for Students** • **Beta Version** • **Open Source**
