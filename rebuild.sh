#!/bin/bash

# Rebuild and restart Home AI Docker stack
# This script rebuilds the containers with latest code changes and restarts the stack

echo "🔄 Rebuilding Home AI Docker Stack..."
echo "====================================="

# Stop the current stack
echo "📦 Stopping current containers..."
sudo docker compose down

# Rebuild the node-api container (with latest code changes)
echo "🔨 Rebuilding node-api container..."
sudo docker compose build --no-cache node-api

# Start the stack
echo "🚀 Starting the stack..."
sudo docker compose up -d

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 5

# Check if services are running
echo "📊 Checking service status..."
sudo docker compose ps

# Test the API
echo "🧪 Testing the API..."
echo "===================="
./test_api.sh

echo ""
echo "✅ Rebuild and restart complete!"
echo "🌐 API is available at: http://localhost:3000"
echo "📖 Check logs with: sudo docker compose logs -f"
