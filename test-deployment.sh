#!/bin/bash

echo "🧪 Testing LinguaTrade Deployment"
echo "================================="

# Get URLs from user
read -p "Enter your Railway backend URL (e.g., https://linguatrade-production-xxxx.up.railway.app): " BACKEND_URL
read -p "Enter your Vercel frontend URL (e.g., https://linguatrade-xxxx.vercel.app): " FRONTEND_URL

echo ""
echo "🔍 Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/health")

if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Backend is healthy!"
    echo "📊 Health data:"
    curl -s "$BACKEND_URL/api/health" | head -3
else
    echo "❌ Backend health check failed (HTTP $HEALTH_RESPONSE)"
fi

echo ""
echo "🔍 Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✅ Frontend is accessible!"
else
    echo "❌ Frontend not accessible (HTTP $FRONTEND_RESPONSE)"
fi

echo ""
echo "🔍 Testing API Endpoints..."
echo "Testing vendors endpoint..."
VENDORS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/vendors")
if [ "$VENDORS_RESPONSE" = "200" ]; then
    echo "✅ Vendors API working!"
else
    echo "❌ Vendors API failed (HTTP $VENDORS_RESPONSE)"
fi

echo ""
echo "🎉 Deployment Test Complete!"
echo "=========================="
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "🌟 Your LinguaTrade platform is live!"
echo "Share it with the world: $FRONTEND_URL"