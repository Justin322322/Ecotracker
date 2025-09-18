# 🌱 EcoTracker - Carbon Footprint Tracker

A modern, responsive landing page for a carbon footprint tracking application built with Next.js 15, React 19, and Shadcn UI.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript 5.6+
- **Beautiful UI**: Shadcn UI components with Tailwind CSS
- **Responsive Design**: Mobile-first approach with smooth animations
- **Performance Optimized**: Turbopack support for faster development
- **Accessibility**: WCAG compliant components
- **SEO Ready**: Optimized metadata and semantic HTML

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.6+
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Package Manager**: Bun (recommended) or npm/yarn

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carbon-footprint-tracker
```

2. Install dependencies:
```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

3. Start the development server:
```bash
# Using Bun with Turbopack (fastest)
bun run dev:turbo

# Or regular development server
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database (MySQL via phpMyAdmin)

1. Install MySQL and phpMyAdmin locally (e.g., XAMPP/WAMP) and start MySQL.
2. Open phpMyAdmin and create a database named `ecotracker` (or your choice).
3. Copy `.env.example` to `.env.local` and update credentials:

```bash
cp .env.example .env.local
# then edit .env.local to match your MySQL setup
```

4. The registration endpoint will auto-create a `users` table on first request.
5. Test registration:

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"Password123!"}'
```

### Initialize Database via Node Script

Instead of first-request creation, you can initialize the database and tables explicitly:

```bash
bun run db:init
```

This reads `.env.local` and will create the database (if missing) and the `users` table.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Landing page
├── components/            # Reusable components
│   └── ui/               # Shadcn UI components
├── lib/                  # Utility functions
│   └── utils.ts         # Tailwind class merging utilities
│   ├── db.ts            # MySQL connection pool (mysql2/promise)
│   └── validations.ts   # Zod schemas (registration, etc.)
├── public/              # Static assets
└── config files         # TypeScript, Tailwind, etc.
```

## 🎨 Design Features

### Landing Page Sections

1. **Hero Section**: Eye-catching introduction with call-to-action
2. **Stats Section**: Key metrics and achievements
3. **Features Section**: Core application capabilities
4. **How It Works**: Step-by-step process explanation
5. **Call-to-Action**: Final conversion section
6. **Footer**: Links and company information

### UI Components Used

- **Button**: Various styles and sizes for different actions
- **Card**: Feature highlights and content sections
- **Badge**: Status indicators and labels
- **Separator**: Visual content dividers

### Color Scheme

- **Primary**: Green/Emerald gradient (environmental theme)
- **Secondary**: Blue/Cyan accents
- **Background**: Subtle green-to-blue gradient
- **Text**: High contrast for accessibility

## 🚀 Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run dev:turbo        # Start with Turbopack (faster)

# Production
bun run build            # Build for production
bun run start            # Start production server

# Code Quality
bun run lint             # Run ESLint
bun run lint:fix         # Fix ESLint issues
bun run format           # Format with Prettier
bun run type-check       # TypeScript type checking

# Testing
bun run test             # Run tests
bun run test:watch       # Run tests in watch mode
```

## 🎯 Performance Features

- **Server Components**: Default server-side rendering
- **Optimized Images**: Next.js Image component ready
- **Code Splitting**: Automatic with App Router
- **Streaming**: Built-in streaming SSR
- **Partial Prerendering**: Next.js 15 PPR support

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Other Platforms

1. Build the project: `bun run build`
2. Deploy the `.next` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library
- [Next.js](https://nextjs.org/) for the React framework
