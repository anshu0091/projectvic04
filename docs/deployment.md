# Deployment Guide

## Deployment Overview

### Supported Platforms
1. Vercel (Recommended)
2. AWS
3. Google Cloud Platform
4. Custom Server
5. Docker Containers

## Prerequisites

### Environment Setup
1. Node.js version 18.x or higher
2. Package manager (npm/yarn)
3. Git
4. Database access (Supabase)
5. Environment variables

### Required Environment Variables
```env
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# API Keys
NEXT_PUBLIC_API_KEY=your_api_key
```

## Build Process

### Production Build
```bash
# Install dependencies
npm install --production

# Build the application
npm run build

# Start the production server
npm start
```

### Build Configuration
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['your-domain.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
```

## Vercel Deployment

### Setup
1. Connect your GitHub repository
2. Configure build settings:
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### Environment Variables
1. Add all required environment variables in Vercel dashboard
2. Configure deployment protection and branch settings

### Deployment Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## AWS Deployment

### EC2 Setup

1. **Instance Configuration**
   ```bash
   # Update system
   sudo apt update
   sudo apt upgrade

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

2. **Security Groups**
   - HTTP (80)
   - HTTPS (443)
   - SSH (22)

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'next-app',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

## Docker Deployment

### Dockerfile
```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
```

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Monitoring & Logging

### Application Monitoring
1. **Error Tracking**
   - Sentry integration
   - Error reporting
   - Performance monitoring

2. **Analytics**
   - Google Analytics
   - Custom events
   - User tracking

### Health Checks
```typescript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
```

## Backup & Recovery

### Database Backups
1. Automated daily backups
2. Manual backup before deployments
3. Backup retention policy
4. Recovery procedures

### File Storage
1. S3 bucket backups
2. CDN cache management
3. Asset versioning

## SSL Configuration

### Let's Encrypt Setup
```bash
# Install Certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot --nginx -d your-domain.com
```

### SSL Configuration
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
}
```

## Performance Optimization

### CDN Setup
1. Configure Cloudflare
2. Asset caching
3. Image optimization
4. Edge functions

### Caching Strategy
1. Browser caching
2. API caching
3. Static generation
4. Incremental Static Regeneration

## Rollback Procedures

### Version Control
1. Tag releases
2. Maintain release branches
3. Document dependencies

### Rollback Steps
1. Identify issue
2. Switch to previous version
3. Verify functionality
4. Monitor metrics

## Security Measures

### Production Checklist
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] SSL certificates valid 

## Container Orchestration

### Kubernetes Deployment

1. **Kubernetes Configuration**
   ```yaml
   # deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: nextjs-app
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: nextjs
     template:
       metadata:
         labels:
           app: nextjs
       spec:
         containers:
         - name: nextjs
           image: your-registry/nextjs-app:latest
           ports:
           - containerPort: 3000
           env:
           - name: NODE_ENV
             value: "production"
           resources:
             limits:
               cpu: "1"
               memory: "1Gi"
             requests:
               cpu: "500m"
               memory: "512Mi"
   ```

2. **Service Configuration**
   ```yaml
   # service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: nextjs-service
   spec:
     type: LoadBalancer
     ports:
     - port: 80
       targetPort: 3000
     selector:
       app: nextjs
   ```

### Helm Charts

1. **Chart Structure**
   ```yaml
   # Chart.yaml
   apiVersion: v2
   name: nextjs-app
   description: A Helm chart for Next.js application
   version: 0.1.0
   ```

2. **Values Configuration**
   ```yaml
   # values.yaml
   replicaCount: 3
   image:
     repository: your-registry/nextjs-app
     tag: latest
     pullPolicy: Always
   service:
     type: LoadBalancer
     port: 80
   ```

## Cloud-Native Deployment

### AWS ECS Configuration

1. **Task Definition**
   ```json
   {
     "family": "nextjs-app",
     "containerDefinitions": [
       {
         "name": "nextjs",
         "image": "your-registry/nextjs-app:latest",
         "memory": 1024,
         "cpu": 256,
         "essential": true,
         "portMappings": [
           {
             "containerPort": 3000,
             "hostPort": 80
           }
         ],
         "environment": [
           {
             "name": "NODE_ENV",
             "value": "production"
           }
         ]
       }
     ]
   }
   ```

2. **Service Definition**
   ```json
   {
     "cluster": "your-cluster",
     "serviceName": "nextjs-service",
     "taskDefinition": "nextjs-app",
     "desiredCount": 3,
     "launchType": "FARGATE",
     "networkConfiguration": {
       "awsvpcConfiguration": {
         "subnets": ["subnet-1", "subnet-2"],
         "securityGroups": ["sg-1"],
         "assignPublicIp": "ENABLED"
       }
     }
   }
   ```

### GCP Cloud Run

1. **Cloud Run Configuration**
   ```yaml
   # service.yaml
   apiVersion: serving.knative.dev/v1
   kind: Service
   metadata:
     name: nextjs-app
   spec:
     template:
       spec:
         containers:
         - image: gcr.io/your-project/nextjs-app
           ports:
           - containerPort: 3000
           resources:
             limits:
               cpu: "1"
               memory: "1Gi"
           env:
           - name: NODE_ENV
             value: "production"
   ```

2. **Deployment Script**
   ```bash
   #!/bin/bash
   
   # Build the container
   gcloud builds submit --tag gcr.io/your-project/nextjs-app
   
   # Deploy to Cloud Run
   gcloud run deploy nextjs-app \
     --image gcr.io/your-project/nextjs-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure Container Apps

1. **Container App Configuration**
   ```yaml
   # container-app.yaml
   apiVersion: containerapp.azure.com/v1alpha1
   kind: ContainerApp
   metadata:
     name: nextjs-app
   spec:
     template:
       containers:
       - image: your-registry/nextjs-app:latest
         name: nextjs
         env:
         - name: NODE_ENV
           value: production
         resources:
           requests:
             cpu: 0.5
             memory: 1Gi
           limits:
             cpu: 1.0
             memory: 2Gi
   ```

2. **Deployment Commands**
   ```bash
   # Create container app
   az containerapp create \
     --name nextjs-app \
     --resource-group your-rg \
     --environment your-env \
     --image your-registry/nextjs-app:latest \
     --target-port 3000 \
     --ingress external
   ``` 