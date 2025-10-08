# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server on localhost (usually port 5173)
- `npm run dev:mock` - Start development server with mock data (default)
- `npm run dev:api` - Start development server with real API calls
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing Commands

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report

### Code Quality Commands

- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is properly formatted

### Environment Setup

- Copy `.env.example` to `.env.local` and configure as needed
- Set `VITE_USE_MOCK_DATA=true` for mock data or `false` for real API
- Set `VITE_GEMINI_API_KEY` for real API integration
- The app uses Vite as the build tool with React and TypeScript

## Project Architecture

### High-Level Structure

**BrightRank** is an AI Visibility Tracker that monitors brand mentions across AI platforms (ChatGPT, Claude, Gemini). It's a single-page React application with a dashboard interface for tracking brand visibility and sentiment analysis.

### Core Application Flow

1. **Landing Page** (`LandingPage.tsx`) - Public marketing site with waitlist functionality
2. **Onboarding** (`OnboardingModal.tsx`) - Collects brand name, keywords, and competitors
3. **Authentication State** - Uses localStorage for session management with 5-minute timeout
4. **Dashboard Flow** - Multi-page application with sidebar navigation

### Key Components Architecture

**App.tsx** - Main application controller that handles:

- Page routing and navigation state
- Authentication/session management with automatic timeout
- Toast notifications system
- Two distinct layouts: public pages vs authenticated dashboard

**State Management Pattern**:

- Uses React hooks (useState, useEffect, useCallback) for local state
- localStorage persistence for user data (`APP_DATA_KEY`)
- Session timeout with activity detection across mouse/keyboard events

**Layout Architecture**:

- **Public Layout**: Header + content for marketing pages (landing, pricing, docs, etc.)
- **App Layout**: Sidebar + main content area for authenticated features (dashboard, keywords, reports, settings)

### Directory Structure

- `components/` - Reusable UI components (modals, forms, sidebar, toast system)
- `pages/` - Full page components for each route
- `services/` - Business logic layer (currently mock data generators)
- `api/` - API integration layer (currently disabled, uses mock data)
- `types.ts` - TypeScript definitions for all data structures

### Data Flow Architecture

**Mock Data System** (`geminiService.ts`):

- Currently uses client-side mock data instead of real API calls
- Dynamic data generation based on brand name and keywords using deterministic algorithms
- Simulates network delays for realistic UX during development

**Key Data Types**:

- `OnboardingData` - User setup information (brand, keywords, competitors)
- `DashboardAnalysisResult` - Complete dashboard analytics data
- `DetailedMention` - Individual AI platform mentions with sentiment
- `ActionableInsight` - AI-generated recommendations for brand improvement

### Component Patterns

**Modal System**: Consistent modal pattern used across:

- `OnboardingModal` - Multi-step form for initial setup
- `JoinWaitlistModal` - Email capture for marketing
- `InitialAnalysisModal` - Loading state during first dashboard load

**Page Guard Pattern**:

- Authentication checks in `App.tsx` prevent direct access to protected routes
- Automatically redirects to landing page if user data is missing

**Toast Notification System**:

- Centralized toast state management in App.tsx
- 5-second auto-dismiss with manual dismiss option
- Used for session timeouts, success messages, and error states

## Development Context

### Styling System

- **TailwindCSS** with custom dark theme configuration in `index.html`
- Custom animations and color palette (brand-purple, dark-bg, etc.)
- Print-specific styles for report generation
- Responsive design with mobile-first approach

### Build Configuration

- **Vite + React + TypeScript** stack
- Path aliases configured for `@/*` imports pointing to root
- ES2022 target with experimental decorators support

### Current State

- **Environment-based API switching** - uses `apiClient.ts` to switch between mock and real API
- **Testing framework** - Vitest with React Testing Library configured
- **Code quality tools** - ESLint and Prettier configured with modern flat config
- **Custom hooks** - Authentication logic extracted to `useAuth` hook
- App is designed to eventually connect to Gemini AI API but currently runs entirely client-side

### Key Improvements Made

- **Testing Infrastructure**: Comprehensive test setup with Vitest, mocks, and utilities
- **Authentication Hook**: Extracted session management logic into reusable `useAuth` hook
- **Environment Configuration**: Easy switching between mock data and real API calls
- **Code Quality**: ESLint, Prettier, and comprehensive linting rules
- **Development Workflow**: Clear separation between development modes

### Key Business Logic

- **Sentiment Analysis**: Tracks positive/neutral/negative mentions across AI platforms
- **Visibility Scoring**: Algorithmic scoring (50-90 range) based on brand presence
- **Competitive Analysis**: Tracks competitor mentions and comparative visibility
- **Report Generation**: PDF export functionality with print-optimized styling
