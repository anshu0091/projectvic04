# Getting Started Guide

## Prerequisites

### System Requirements

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Memory**: Minimum 4GB RAM recommended
- **Storage**: At least 1GB of free space
- **Operating System**: 
  - Windows 10 or higher
  - macOS 10.15 or higher
  - Linux (Ubuntu 20.04 or equivalent)

### Development Tools

1. **Code Editor**
   - Visual Studio Code (recommended)
   - Recommended extensions:
     - ESLint
     - Prettier
     - TypeScript and JavaScript Language Features
     - Tailwind CSS IntelliSense
     - GitLens

2. **Version Control**
   - Git 2.x or higher
   - GitHub account

3. **Browser**
   - Chrome (latest version) with React Developer Tools
   - Firefox (latest version)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

### Step 2: Environment Setup

1. Create environment files:
```bash
cp .env.example .env.local
```

2. Configure the following variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Database Setup

1. Create a Supabase account
2. Create a new project
3. Run the database migrations:
```bash
npm run db:migrate
```

## Development Environment

### Starting the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript checks

### Development Modes

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Production Simulation**
   ```bash
   npm run build
   npm run start
   ```

3. **Debug Mode**
   ```bash
   npm run dev:debug
   ```

## First Steps

### 1. Verify Installation

After starting the development server, verify these endpoints:

- Homepage: `http://localhost:3000`
- API health check: `http://localhost:3000/api/health`
- Authentication: `http://localhost:3000/auth/login`

### 2. Create Test Account

1. Navigate to `/auth/register`
2. Create a test account
3. Verify email (check console in development)

### 3. Explore Basic Features

- Test authentication flow
- Explore UI components
- Try CRUD operations
- Test responsive design

## Troubleshooting Installation

### Common Issues

1. **Node Version Mismatch**
   ```bash
   nvm use 18
   npm install
   ```

2. **Port Conflicts**
   ```bash
   kill $(lsof -t -i:3000)
   npm run dev
   ```

3. **Dependencies Issues**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

### Getting Help

If you encounter any issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Search existing GitHub issues
3. Create a new issue with:
   - Node.js version
   - npm version
   - Operating system
   - Error message
   - Steps to reproduce

## Next Steps

- Read the [Architecture Overview](./architecture.md)
- Explore [Features & Components](./features.md)
- Review [Development Guide](./development.md)
- Set up your [Development Environment](./development.md#development-environment) 