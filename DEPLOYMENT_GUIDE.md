DEPLOYMENT_GUIDE.md

# Deployment Guide

## Production Deployment

### 1. Environment Setup

```bash
# Create production .env
# server/.env
PORT=5000
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

### 2. Database Backup

```bash
# Backup database
cp database.sqlite database.sqlite.backup.$(date +%Y%m%d)
```

### 3. Backend Deployment

```bash
# Install dependencies
cd server
npm install --production

# Start with process manager (PM2)
npm install -g pm2
pm2 start server.js --name "gaushala-api"
pm2 save
pm2 startup
```

### 4. Frontend Build

```bash
cd client
npm run build
# dist/ folder ready for static hosting
```

### 5. Deploy to Server

```bash
# Option 1: Using Heroku
heroku create gaushala-app
git push heroku main

# Option 2: Using Docker
docker build -t gaushala .
docker run -p 5000:5000 gaushala

# Option 3: Using DigitalOcean/AWS/Azure
# Upload dist/ to static hosting
# Deploy server with PM2/systemd
```

### 6. Security Checklist

- [ ] Change admin password in production
- [ ] Use HTTPS only
- [ ] Set strong SECRET_KEY
- [ ] Enable CORS for production domain only
- [ ] Backup database regularly
- [ ] Setup monitoring and alerts
- [ ] Configure rate limiting
- [ ] Enable CSRF protection

### 7. Monitoring

```bash
pm2 logs gaushala-api
pm2 monit
```

## Scaling

For large-scale deployment:
1. Use PostgreSQL instead of SQLite
2. Implement Redis caching
3. Setup database replication
4. Use CDN for static files
5. Implement logging (Winston/Morgan)
6. Setup error tracking (Sentry)
