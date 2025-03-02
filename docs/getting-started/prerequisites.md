# Prerequisites

## Navigation

- [← Back to Getting Started](./index.md)
- [↑ Up to Index](../README.md)
- [→ Next: Installation](./installation.md)

## System Requirements

### Hardware Requirements
- CPU: Dual-core processor or better
- RAM: Minimum 4GB (8GB recommended)
- Storage: 1GB free space
- Internet: Broadband connection

### Software Requirements

1. **Node.js Environment**
   ```bash
   # Check Node.js version
   node --version  # Must be ≥ 18.x
   npm --version   # Must be ≥ 8.x
   ```

2. **Operating System**
   - Windows 10/11
   - macOS 10.15 or later
   - Ubuntu 20.04 or later

3. **Git**
   ```bash
   # Check Git version
   git --version  # Must be ≥ 2.x
   ```

## Development Tools

### Required IDE/Editor
- Visual Studio Code (recommended)
- WebStorm
- Sublime Text
- Atom

### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "graphql.vscode-graphql"
  ]
}
```

### Browser Requirements
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Required Accounts

### Development Services
1. **GitHub Account**
   - Access to repository
   - SSH key configured
   - 2FA enabled

2. **Supabase Account**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Vercel Account** (for deployment)
   - Connected to GitHub
   - Team permissions set

## Environment Setup

### Node.js Setup
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or direct installation
# Download from https://nodejs.org/
```

### Git Configuration
```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
```

### Environment Variables
```bash
# Create environment file
cp .env.example .env.local

# Required variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Verification Checklist

- [ ] Node.js and npm installed
- [ ] Git configured
- [ ] IDE/Editor set up
- [ ] Required accounts created
- [ ] SSH keys configured
- [ ] Environment variables set
- [ ] Development tools installed

## Next Steps

Once you have confirmed all prerequisites are met:
1. Proceed to [Installation Guide](./installation.md)
2. Set up your [Development Environment](../guides/development.md)
3. Review the [Architecture Overview](../architecture/overview.md)

## Troubleshooting

If you encounter issues:
- Check our [Troubleshooting Guide](../guides/troubleshooting.md)
- Review [Common Issues](../guides/troubleshooting.md#common-issues)
- Contact [Support](../reference/support.md) 