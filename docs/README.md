# RNexus Frontend

A modern React application built with TypeScript, Vite, and Tailwind CSS.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Modern UI Components** with shadcn/ui style

## Platform Modules

### 📢 News, Alerts, and Communication
This module is a centralized tool for disseminating important information, managing alerts, and broadcasting official communications to the entire organization or specific departments.

- **News Publishing**: Empowers every department to publish official news and updates to a designated news feed
- **Alerts Management**: Designed to create and manage time-sensitive alerts, ensuring critical information reaches the right people immediately
- **Official Communications**: Serves as a platform for sending formal communications and memos to targeted groups or the entire company

### 🏭 Production Management
Real-time monitoring and management of manufacturing lines with efficiency tracking and alerts.

### 📊 Business Intelligence
Comprehensive analytics dashboard with KPI visualization, trend analysis, and reporting.

### 👥 Team Collaboration
Project monitoring, task management, and collaboration tools with real-time communication.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── Layout.tsx      # Main layout component
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Activities.tsx  # Activities page
│   ├── Chat.tsx        # Chat page
│   └── ...             # Other pages
├── lib/                # Utility functions
│   └── utils.ts        # Common utilities
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Technologies Used

- **React 18.3.1** - UI library
- **TypeScript 5.9.2** - Type safety
- **Vite 7.0.6** - Build tool
- **React Router 6.28.0** - Routing
- **Tailwind CSS 4.1.11** - Styling
- **Lucide React 0.468.0** - Icons

## Development

The application uses a modern tech stack with:

- **Component-based architecture** with React hooks
- **Type-safe development** with TypeScript
- **Modern styling** with Tailwind CSS
- **Fast development** with Vite's hot module replacement
- **Clean code** with ESLint and Prettier

## Building for Production

```bash
npm run build
```

This will create a `dist` folder with optimized production files.

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new code
3. Write meaningful commit messages
4. Test your changes before submitting
