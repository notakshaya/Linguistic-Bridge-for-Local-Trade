# 🚀 LinguaTrade Deployment Guide

This guide will help you deploy LinguaTrade to various platforms for public access.

## 🌐 Deployment Options

### Option 1: Railway (Backend) + Vercel (Frontend) - **RECOMMENDED**

#### Step 1: Deploy Backend to Railway

1. **Create Railway Account**: Go to [railway.app](https://railway.app) and sign up
2. **Connect GitHub**: Link your GitHub repository
3. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your LinguaTrade repository
4. **Configure Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-frontend-domain.vercel.app
   JWT_SECRET=your-super-secret-jwt-key-here
   ```
5. **Deploy**: Railway will automatically build and deploy using the Dockerfile

#### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `client`
3. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app
   VITE_ENVIRONMENT=production
   ```
5. **Deploy**: Vercel will build and deploy automatically

### Option 2: Render (Full Stack)

1. **Create Render Account**: Go to [render.com](https://render.com)
2. **Create Web Service**:
   - Connect GitHub repository
   - Use the provided `render.yaml` configuration
3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   CLIENT_URL=https://your-app-name.onrender.com
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

### Option 3: Netlify (Frontend) + Railway (Backend)

1. **Deploy Backend**: Follow Railway steps above
2. **Deploy Frontend to Netlify**:
   - Connect GitHub repository
   - Set build directory to `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Use the provided `netlify.toml` configuration

## 🔧 Pre-Deployment Checklist

### 1. Update API URLs
Make sure your frontend points to the correct backend URL:

```javascript
// In client/src/config/api.js
const API_BASE_URL = 'https://your-backend-domain.com';
```

### 2. Environment Variables
Set up these environment variables on your deployment platform:

**Backend:**
```
NODE_ENV=production
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-super-secret-jwt-key-change-this
```

**Frontend:**
```
VITE_API_URL=https://your-backend-domain.com
VITE_ENVIRONMENT=production
```

### 3. CORS Configuration
The server is already configured to accept requests from common deployment domains.

## 🚀 Quick Deploy Commands

### Build for Production
```bash
# Build client
cd client && npm run build

# Test production build locally
npm start
```

### Deploy to Railway (Backend)
```bash
# Push to GitHub (Railway auto-deploys)
git add .
git commit -m "Deploy to production"
git push origin main
```

### Deploy to Vercel (Frontend)
```bash
# Using Vercel CLI
npm i -g vercel
cd client
vercel --prod
```

## 🔍 Post-Deployment Testing

1. **Health Check**: Visit `https://your-backend-url.com/api/health`
2. **Frontend**: Visit your frontend URL
3. **Real-time Features**: Test chat and negotiation features
4. **API Endpoints**: Test authentication and data fetching

## 🌍 Custom Domain Setup

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Railway Custom Domain
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS CNAME record

## 📊 Monitoring & Analytics

### Add Monitoring
```javascript
// Add to your environment variables
VITE_GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_MIXPANEL_TOKEN=your_mixpanel_token
```

### Error Tracking
Consider adding Sentry for error tracking:
```bash
npm install @sentry/react @sentry/node
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Ensure all deployments use HTTPS
3. **CORS**: Configure CORS properly for your domains
4. **JWT Secret**: Use a strong, unique JWT secret
5. **Rate Limiting**: Consider adding rate limiting for production

## 🎯 Performance Optimization

1. **CDN**: Both Vercel and Netlify provide global CDN
2. **Caching**: Configure appropriate cache headers
3. **Bundle Size**: Monitor and optimize bundle size
4. **Database**: Consider adding a real database for production

## 🆘 Troubleshooting

### Common Issues:

1. **CORS Errors**: Check CORS configuration in server/index.js
2. **Build Failures**: Check Node.js version compatibility
3. **Socket.IO Issues**: Ensure WebSocket support is enabled
4. **Environment Variables**: Verify all required env vars are set

### Debug Commands:
```bash
# Check build locally
npm run build
npm start

# Check logs
# Railway: View in dashboard
# Vercel: Use `vercel logs`
# Render: View in dashboard
```

## 🎉 Success!

Once deployed, your LinguaTrade platform will be publicly accessible with:
- ✅ Real-time translation
- ✅ AI-powered negotiation
- ✅ Global marketplace
- ✅ Responsive design
- ✅ Production-ready performance

**Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-app.up.railway.app`
- Health Check: `https://your-app.up.railway.app/api/health`

Share your deployed LinguaTrade platform with the world! 🌍✨