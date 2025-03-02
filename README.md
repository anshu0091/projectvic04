# Next.js Application Documentation

## Project Overview
This is a modern web application built with Next.js 13.5.1, featuring a comprehensive UI component library, authentication, state management, and various interactive features.

## Tech Stack

### Core Technologies
- **Next.js** (v13.5.1) - React framework for production
- **React** (v18.2.0) - UI library
- **TypeScript** (v5.2.2) - Type-safe JavaScript
- **Tailwind CSS** (v3.3.3) - Utility-first CSS framework

### State Management
- **Redux Toolkit** (v2.2.1) - State management
- **React Redux** (v9.1.0) - React bindings for Redux
- **Redux Persist** (v6.0.0) - State persistence

### Authentication & Backend
- **Supabase Auth Helpers** (v0.9.0) - Authentication utilities
- **Supabase JS** (v2.39.0) - Backend as a Service

### UI Components
- **Radix UI** - Unstyled, accessible components including:
  - Accordion, Alert Dialog, Avatar
  - Dialog, Dropdown Menu, Navigation
  - Form elements (Checkbox, Radio, Select)
  - And many more interactive components
- **Lucide React** (v0.446.0) - Icon library
- **Sonner** (v1.5.0) - Toast notifications
- **Embla Carousel** (v8.3.0) - Carousel component
- **React Day Picker** (v8.10.1) - Date picker
- **Recharts** (v2.12.7) - Charting library

### Form Handling
- **React Hook Form** (v7.53.0) - Form management
- **Zod** (v3.23.8) - Schema validation
- **@hookform/resolvers** (v3.9.0) - Form validation resolvers

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development
Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Building for Production
```bash
npm run build
npm start
```

## Project Structure
```
├── app/                 # Next.js 13 app directory
├── components/          # Reusable UI components
├── lib/                 # Utility functions and configurations
├── public/             # Static assets
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Configuration Files
- `next.config.js` - Next.js configuration
  - ESLint ignored during builds
  - Unoptimized images enabled
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration

## Features
- 🔐 Authentication with Supabase
- 🎨 Modern UI with Radix UI components
- 📊 Data visualization with Recharts
- 🎯 Form handling with React Hook Form
- 🔄 State management with Redux
- 🌓 Theme switching capability
- 📱 Responsive design
- ♿ Accessibility features

## Best Practices
- Use TypeScript for type safety
- Follow React and Next.js best practices
- Implement responsive design
- Ensure accessibility compliance
- Maintain clean code structure
- Use proper error handling
- Implement proper state management

## Performance Considerations
- Optimized image handling
- Code splitting
- Lazy loading where appropriate
- Server-side rendering
- Static site generation where possible

## Deployment
This application can be deployed to various platforms:
- Vercel (recommended)
- Netlify
- AWS
- Google Cloud Platform
- Custom server

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is private and proprietary.

## Support
For support, please contact the development team. 