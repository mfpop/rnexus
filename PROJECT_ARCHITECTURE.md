# RNexus Platform Architecture

## Overview
RNexus is a comprehensive production management platform built with React 19 and TypeScript, featuring a modern master-detail architecture with stable layout templates.

## Platform Modules

### 📢 News, Alerts, and Communication
This module is a centralized tool for disseminating important information, managing alerts, and broadcasting official communications to the entire organization or specific departments.

**Core Functions:**
- **News Publishing**: Empowers every department to publish official news and updates to a designated news feed
- **Alerts Management**: Designed to create and manage time-sensitive alerts, ensuring critical information reaches the right people immediately
- **Official Communications**: Serves as a platform for sending formal communications and memos to targeted groups or the entire company

**Technical Implementation:**
- Uses `NewsContext` for state management
- Master-detail pattern with article list and detailed view
- Real-time updates and notification system
- Department-based publishing permissions

### 🏭 Production Management
Real-time monitoring and management of manufacturing lines with efficiency tracking and alerts.

### 📊 Business Intelligence
Comprehensive analytics dashboard with KPI visualization, trend analysis, and reporting.

### 👥 Team Collaboration
Project monitoring, task management, and collaboration tools with real-time communication.

## Architecture Principles

### 1. Stable Layout Pattern
- **StableLayout** serves as the root layout component that never changes
- All main application pages are rendered within this stable framework
- Consistent navigation and sidebar functionality across all pages

### 2. Master-Detail Architecture
- Two-card layout pattern for efficient data browsing and management
- Left card displays lists/navigation (master)
- Right card shows detailed content (detail)
- Context API manages communication between master and detail components

### 3. Template-Based Design
- Reusable template components for consistent UI patterns
- `LayoutTemplate`, `MainContainerTemplate`, `LeftSidebarTemplate`, `RightSidebarTemplate`
- Standardized props and interfaces across templates

## Directory Structure

```
frontend/src/
├── components/
│   ├── templates/           # Layout templates (stable, reusable)
│   │   ├── LayoutTemplate.tsx
│   │   ├── LeftSidebarTemplate.tsx
│   │   ├── MainContainerTemplate.tsx
│   │   └── RightSidebarTemplate.tsx
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   └── ScrollArea.tsx
│   ├── [feature]/          # Feature-specific components
│   │   ├── [Feature]Context.tsx      # React Context for state
│   │   ├── [Feature]LeftCard.tsx     # Master list component
│   │   ├── [Feature]RightCard.tsx    # Detail view component
│   │   └── index.ts                  # Module exports
│   └── StableLayout.tsx     # Root layout orchestrator
├── pages/                   # Page components (minimal, routing only)
│   ├── [Feature]Page.tsx    # Feature pages (render RightCard only)
│   ├── MainPage.tsx         # Home page
│   └── index.ts
├── lib/                     # Utilities and helpers
│   └── utils.ts
└── main.tsx                # Application entry point
```

## Component Patterns

### Feature Module Structure
Each feature follows a consistent structure:

```typescript
// Context for state management
export interface FeatureContextType {
  selectedItem: ItemType | null
  setSelectedItem: (item: ItemType | null) => void
}

// Left card (master) - renders list, manages selection
const FeatureLeftCard: React.FC = () => {
  const { selectedItem, setSelectedItem } = useFeatureContext()
  // Render list with click handlers
}

// Right card (detail) - displays selected item details
const FeatureRightCard: React.FC = () => {
  const { selectedItem } = useFeatureContext()
  // Render detailed view
}

// Page component - minimal wrapper
const FeaturePage: React.FC = () => {
  return <FeatureRightCard />
}
```

### StableLayout Integration
The StableLayout component dynamically renders appropriate components based on the current route:

```typescript
// StableLayout determines which components to render
const getPageConfig = (pathname: string) => {
  switch (pathname) {
    case '/feature':
      return {
        leftTitle: 'Feature Navigation',
        rightTitle: 'Feature Details',
        // ... other config
      }
  }
}

// Conditional rendering based on route
{location.pathname === '/feature' ? (
  <FeatureProvider>
    <MainContainerTemplate
      leftContent={<FeatureLeftCard />}
      rightContent={<Outlet />}
      // ... other props
    />
  </FeatureProvider>
) : (
  // Other route handling
)}
```

## State Management

### Context API Pattern
- Each feature has its own React Context for state management
- Contexts manage communication between left and right cards
- No global state management - keeps features isolated

### Data Flow
1. User clicks item in left card (master)
2. Left card calls `setSelectedItem` from context
3. Context updates state
4. Right card (detail) receives updated `selectedItem`
5. Right card re-renders with new data

## Styling and Theming

### Tailwind CSS
- Utility-first CSS framework
- Consistent design tokens across components
- Responsive design with mobile-first approach

### Color Scheme
- **Primary**: Teal (`teal-600`, `teal-700`) for main actions
- **Secondary**: Gray (`gray-50` to `gray-900`) for backgrounds and text
- **Accent**: Blue for links and highlights
- **Status**: Standard semantic colors (green, yellow, red)

### Spacing System
- **Sidebar buttons**: `space-y-1.5` for compact layout
- **Card content**: `space-y-4` to `space-y-6` for readability
- **Form elements**: `space-y-3` for forms

## Performance Optimizations

### Code Splitting
- Route-based code splitting with React Router
- Lazy loading of components where appropriate

### Context Optimization
- Feature-specific contexts prevent unnecessary re-renders
- Contexts only manage minimal state required for master-detail communication

### Bundle Optimization
- Vite for fast development and optimized builds
- Tree shaking to eliminate unused code
- Modern ES modules for better performance

## Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for context providers
- End-to-end tests for complete user flows

### Testing Tools
- **Vitest** for unit and integration testing
- **Playwright** for end-to-end testing
- **React Testing Library** for component testing

## Security Considerations

### Authentication
- Secure login with multi-factor authentication
- Role-based access control (admin, staff, user)
- Session management with secure tokens

### Data Protection
- Input validation and sanitization
- XSS protection through React's built-in escaping
- CSRF protection for state-changing operations

## Deployment and DevOps

### Build Process
- TypeScript compilation with strict type checking
- ESLint for code quality and consistency
- Prettier for code formatting

### Development Workflow
- Hot module replacement for fast development
- Automatic type checking and linting
- Pre-commit hooks for code quality

## Browser Support

### Target Browsers
- Chrome 88+ (main target)
- Firefox 85+
- Safari 14+
- Edge 88+

### Progressive Enhancement
- Core functionality works in all supported browsers
- Enhanced features for modern browsers
- Graceful degradation for older browsers

## Accessibility

### WCAG Compliance
- ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Responsive Design
- Mobile-first responsive layout
- Touch-friendly interface elements
- Adaptive content for different screen sizes

---

This architecture provides a scalable, maintainable foundation for the RNexus platform while ensuring consistent user experience and developer productivity.
