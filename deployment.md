# Smart Village Management Portal – Deployment Guide

**Project:** Smart Village Management Portal  
**Organization:** CSIR-CBRI Roorkee

---

# Overview

This project is deployed on **AWS EC2** using:

- React + Vite (Frontend)
- Node.js + Express (Backend)
- MongoDB Atlas (Database)
- AWS S3 (Media Storage)
- Nginx (Reverse Proxy & Static File Server)
- PM2 (Backend Process Manager)
- GitHub Actions (Automatic Deployment)

---

# Production Architecture

```
                    Internet
                        │
                        ▼
               Public IP / Domain
                        │
                        ▼
                     Nginx
                (Port 80 / 443)
                        │
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
React Production Build           Express Backend
(/var/www/html)                  PM2 Process
                                        │
                                        ▼
                                MongoDB Atlas

Images / PDFs
        │
        ▼
      AWS S3
```

---

# Server Information

Operating System

```
Ubuntu Server
```

Application Directory

```
~/Smart-Village-Website
```

Frontend

```
~/Smart-Village-Website/client
```

Backend

```
~/Smart-Village-Website/server
```

React Build Output

```
client/dist
```

Nginx Root

```
/var/www/html
```

Nginx Configuration

```
/etc/nginx/sites-available/default
```

---

# Technology Stack

Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

Backend

- Node.js
- Express.js
- JWT Authentication
- RBAC
- Multer
- AWS SDK

Database

- MongoDB Atlas

Storage

- AWS S3

Deployment

- AWS EC2
- PM2
- Nginx
- GitHub Actions

---

# Environment Variables

Frontend

Location

```
client/.env
```

Current

```
VITE_API_URL=http://<EC2_PUBLIC_IP>/api
```

After domain & HTTPS

```
VITE_API_URL=https://your-domain/api
```

Frontend must be rebuilt after changing this value.

---

Backend

Location

```
server/.env
```

Contains

- MongoDB URI
- JWT Secrets
- SMTP Configuration
- AWS Credentials
- S3 Bucket Configuration

---

# PM2

Check Status

```bash
pm2 status
```

Restart Backend

```bash
pm2 restart smart-village-api
```

View Logs

```bash
pm2 logs smart-village-api
```

Save Process List

```bash
pm2 save
```

Startup on Boot

```bash
pm2 startup
```

---

# Nginx

Test Configuration

```bash
sudo nginx -t
```

Reload

```bash
sudo systemctl reload nginx
```

Restart

```bash
sudo systemctl restart nginx
```

Status

```bash
sudo systemctl status nginx
```

---

# GitHub Actions (CI/CD)

Automatic deployment is configured.

Whenever code is pushed to the `main` branch:

1. Connects to EC2 via SSH.
2. Pulls the latest code.
3. Installs backend dependencies.
4. Restarts the backend using PM2.
5. Installs frontend dependencies.
6. Builds the React application.
7. Copies the new build to `/var/www/html`.
8. Reloads Nginx.

Workflow file:

```
.github/workflows/deploy.yml
```

---

# Manual Deployment (Fallback)

If GitHub Actions is unavailable:

## Backend

```bash
cd ~/Smart-Village-Website

git pull origin main

cd server

npm install

pm2 restart smart-village-api
```

---

## Frontend

```bash
cd ~/Smart-Village-Website/client

npm install

npm run build

sudo rm -rf /var/www/html/*

sudo cp -r dist/* /var/www/html/

sudo systemctl reload nginx
```

---

# Useful Git Commands

Check Status

```bash
git status
```

Pull Latest Code

```bash
git pull origin main
```

Check Remote

```bash
git remote -v
```

---

# AWS Services Used

- EC2
- S3
- IAM

Database

- MongoDB Atlas

Version Control

- GitHub

Deployment

- GitHub Actions

---

# Current Status

Completed

- AWS EC2 Deployment
- MongoDB Atlas Configuration
- AWS S3 Configuration
- Nginx Configuration
- PM2 Configuration
- Frontend Deployment
- Backend Deployment
- GitHub Actions CI/CD
- Admin Panel
- Public Portal
- Media Uploads
- Authentication
- CRUD APIs

---

# Remaining Work

## Infrastructure

- Obtain production domain.
- Point DNS to EC2 Elastic IP.
- Install SSL using Let's Encrypt / Certbot.
- Update `VITE_API_URL` to the HTTPS domain.
- Rebuild frontend after changing the API URL.

---

## Security

- Security headers
- Fail2Ban
- Firewall review
- SSH hardening review

---

## Monitoring

- PM2 log rotation
- Disk monitoring
- CPU monitoring
- Memory monitoring

---

## Backup

- MongoDB Atlas backups
- S3 backup strategy
- EC2 recovery plan

---

## Performance

- Redis caching (if introduced)
- Database query optimization
- Image optimization
- Lazy loading
- Bundle optimization

---

# Troubleshooting

## Backend not responding

```bash
pm2 status

pm2 logs smart-village-api
```

---

## Frontend changes not visible

```bash
cd client

npm run build

sudo cp -r dist/* /var/www/html/

sudo systemctl reload nginx
```

Perform a hard refresh in the browser (`Ctrl + Shift + R`).

---

## Nginx errors

```bash
sudo nginx -t

sudo systemctl restart nginx
```

---

## GitHub Actions failed

Check:

GitHub Repository

```
Actions
```

Review the failed workflow logs.

---

# Important Notes

- Do not edit files directly on the EC2 server unless necessary.
- Make code changes locally, commit, and push to GitHub.
- GitHub Actions handles deployment automatically on pushes to the `main` branch.
- Any change to frontend environment variables requires rebuilding the React application.

---

# Handover Notes

The application is successfully deployed and operational.

The remaining work focuses on production readiness:

1. Configure the production domain.
2. Enable HTTPS.
3. Complete infrastructure hardening.
4. Continue feature development as required.
5. Perform final optimization and testing before production release.