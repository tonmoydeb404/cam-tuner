#!/bin/bash

# Cam Tuner Development Helper Script

echo "🚀 Cam Tuner Development Helper"
echo "================================"

# Check which port is running
PORT=3000
if ! lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PORT=3001
    elif lsof -Pi :3004 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PORT=3004
    else
        echo "❌ No dev server is running on ports 3000, 3001, or 3004"
        echo ""
        echo "To start the dev server, run:"
        echo "  cd /mnt/dev/garage/cam-tuner/apps/web"
        echo "  npm run dev"
        exit 1
    fi
fi

echo "✅ Dev server is running on http://localhost:$PORT"
echo ""
echo "📖 Testing pages..."
echo ""

# Test home page
echo "Testing Home Page (/)..."
if curl -s "http://localhost:$PORT" | grep -q "Cam Tuner"; then
    echo "✅ Home page loaded successfully"
    echo "   - Hero section: $(curl -s "http://localhost:$PORT" | grep -o 'Cam Tuner' | head -1)"
else
    echo "❌ Home page failed to load"
fi

# Test preview page
echo ""
echo "Testing Preview Page (/preview)..."
if curl -s "http://localhost:$PORT/preview" | grep -q "Preview"; then
    echo "✅ Preview page loaded successfully"
else
    echo "❌ Preview page failed to load"
fi

echo ""
echo "🌐 Open in browser:"
echo "   - Home:     http://localhost:$PORT"
echo "   - Preview:  http://localhost:$PORT/preview"
echo ""
echo "================================"
