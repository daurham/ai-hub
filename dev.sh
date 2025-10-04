#!/bin/bash

# Development script for Home AI project
# Usage: ./dev.sh [command]
# Commands: rebuild, restart, logs, test, status, clean

case "${1:-rebuild}" in
  "rebuild")
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
    ;;
    
  "restart")
    echo "🔄 Restarting Home AI Docker Stack..."
    echo "====================================="
    
    sudo docker compose restart
    sleep 3
    sudo docker compose ps
    echo "✅ Restart complete!"
    ;;
    
  "logs")
    echo "📋 Showing Home AI logs..."
    echo "========================="
    sudo docker compose logs -f
    ;;
    
  "test")
    echo "🧪 Testing Home AI API..."
    echo "========================="
    ./test_api.sh
    echo ""
    echo "🧪 Testing Streaming API..."
    echo "==========================="
    ./test_stream.sh
    ;;
    
  "status")
    echo "📊 Home AI Service Status..."
    echo "============================"
    echo "Docker Compose Status:"
    sudo docker compose ps
    echo ""
    echo "Systemd Service Status:"
    sudo systemctl status home-ai-api.service --no-pager
    ;;
    
  "clean")
    echo "🧹 Cleaning up Home AI Docker resources..."
    echo "=========================================="
    
    # Stop and remove containers
    sudo docker compose down
    
    # Remove unused images
    sudo docker image prune -f
    
    # Remove unused volumes (be careful with this!)
    read -p "⚠️  Remove unused volumes? This will delete AI models! (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo docker volume prune -f
        echo "🗑️  Volumes removed. You'll need to re-download AI models."
    else
        echo "📦 Volumes preserved."
    fi
    
    echo "✅ Cleanup complete!"
    ;;
    
  "help"|"-h"|"--help")
    echo "🛠️  Home AI Development Script"
    echo "=============================="
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  rebuild  - Rebuild containers with latest code and restart (default)"
    echo "  restart  - Restart existing containers"
    echo "  logs     - Show live logs from all containers"
    echo "  test     - Run all API tests (regular + streaming)"
    echo "  status   - Show status of Docker and systemd services"
    echo "  clean    - Clean up Docker resources (containers, images, volumes)"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./dev.sh           # Rebuild and restart (default)"
    echo "  ./dev.sh restart   # Just restart containers"
    echo "  ./dev.sh logs      # Watch logs"
    echo "  ./dev.sh test      # Run tests"
    ;;
    
  *)
    echo "❌ Unknown command: $1"
    echo "Run './dev.sh help' for available commands"
    exit 1
    ;;
esac
