# Home AI Project

A Docker-based Home AI API server that provides intelligent responses using Ollama AI models. The system automatically starts on boot and provides three specialized endpoints for different use cases.

## 🚀 Features

- **Nutrition Analysis** - Uses Mistral model for nutrition-related queries
- **Home Assistant** - Uses Llama3 for home automation commands
- **Generic AI** - Uses Llama3 for general AI conversations
- **Auto-start** - Automatically starts on system boot
- **Docker-based** - Fully containerized with Docker Compose
- **API Key Authentication** - Secure access with API key

## 📋 Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM (for AI models)
- Linux system with systemd

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/daurham/home-ai
   cd home-ai
   ```

2. **Set up environment**
   ```bash
   # Create .env file in node-api directory
   echo "API_KEY=your-strong-api-key-here" > node-api/.env
   ```

3. **Start the services**
   ```bash
   sudo docker compose up -d
   ```

4. **Download AI models**
   ```bash
   sudo docker exec home-ai-ollama ollama pull mistral
   sudo docker exec home-ai-ollama ollama pull llama3
   ```

5. **Set up auto-start**
   ```bash
   sudo cp home-ai-api.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable home-ai-api.service
   sudo systemctl start home-ai-api.service
   ```

## 🧪 Testing

Test your API with the provided scripts:

```bash
# Test all endpoints
./test_api.sh

# Or use Python script
python3 test_api.py
```

## 🔧 Management Commands

### Docker Compose Management

**Start the entire stack:**
```bash
sudo docker compose up -d
```

**Stop the entire stack:**
```bash
sudo docker compose down
```

**Restart the stack:**
```bash
sudo docker compose restart
```

**View logs:**
```bash
# All services
sudo docker compose logs -f

# Specific service
sudo docker compose logs -f node-api
sudo docker compose logs -f ollama
```

**Check status:**
```bash
sudo docker compose ps
```

**Rebuild containers:**
```bash
# Rebuild specific service
sudo docker compose build --no-cache node-api

# Rebuild all services
sudo docker compose build --no-cache
```

### Systemd Service Management

**Start/Stop/Restart the auto-start service:**
```bash
sudo systemctl start home-ai-api.service
sudo systemctl stop home-ai-api.service
sudo systemctl restart home-ai-api.service
```

**Check service status:**
```bash
sudo systemctl status home-ai-api.service
```

**View service logs:**
```bash
sudo journalctl -u home-ai-api.service -f
```

**Enable/Disable auto-start:**
```bash
sudo systemctl enable home-ai-api.service
sudo systemctl disable home-ai-api.service
```

### AI Model Management

**List installed models:**
```bash
sudo docker exec home-ai-ollama ollama list
```

**Download new models:**
```bash
sudo docker exec home-ai-ollama ollama pull <model-name>
```

**Remove models:**
```bash
sudo docker exec home-ai-ollama ollama rm <model-name>
```

## 🌐 API Usage

### Base URL
- **Local:** `http://localhost:3000`
- **Network:** `http://192.168.0.13:3000` (replace with your IP)

### Authentication
All endpoints require an API key in the `x-api-key` header.

### Endpoints

#### 1. Nutrition Analysis
```bash
curl -X POST http://localhost:3000/api/nutrition \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"query": "What are the benefits of apples?"}'
```

#### 2. Home Assistant
```bash
curl -X POST http://localhost:3000/api/home-assistant \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"message": "Turn on the living room lights"}'
```

#### 3. Generic AI
```bash
curl -X POST http://localhost:3000/api/ai \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"query": "Explain quantum computing"}'
```

#### 4. Streaming AI (Real-time response)
```bash
curl -X POST http://localhost:3000/api/ai/stream \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"query": "Explain quantum computing"}' \
  --no-buffer
```

### JavaScript Examples

#### 1. Nutrition Analysis
```javascript
const response = await fetch('http://localhost:3000/api/nutrition', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    query: 'What are the benefits of apples?'
  })
});

const data = await response.json();
console.log(data.result);
```

#### 2. Home Assistant
```javascript
const response = await fetch('http://localhost:3000/api/home-assistant', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    message: 'Turn on the living room lights'
  })
});

const data = await response.json();
console.log(data.reply);
```

#### 3. Generic AI
```javascript
const response = await fetch('http://localhost:3000/api/ai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    query: 'Explain quantum computing'
  })
});

const data = await response.json();
console.log(data.result);
```

#### Using Axios (if you prefer)
```javascript
import axios from 'axios';

// Nutrition Analysis
const nutritionResponse = await axios.post('http://localhost:3000/api/nutrition', {
  query: 'What are the benefits of apples?'
}, {
  headers: {
    'x-api-key': 'your-api-key'
  }
});
console.log(nutritionResponse.data.result);

// Home Assistant
const homeResponse = await axios.post('http://localhost:3000/api/home-assistant', {
  message: 'Turn on the living room lights'
}, {
  headers: {
    'x-api-key': 'your-api-key'
  }
});
console.log(homeResponse.data.reply);

// Generic AI
const aiResponse = await axios.post('http://localhost:3000/api/ai', {
  query: 'Explain quantum computing'
}, {
  headers: {
    'x-api-key': 'your-api-key'
  }
});
console.log(aiResponse.data.result);
```

#### 4. Streaming AI (Real-time response)
```javascript
const response = await fetch('http://localhost:3000/api/ai/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    query: 'Explain quantum computing'
  })
});

// Handle streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  process.stdout.write(chunk); // Print each chunk as it arrives
}
```

#### Using Axios for Streaming
```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/ai/stream', {
  query: 'Explain quantum computing'
}, {
  headers: {
    'x-api-key': 'your-api-key'
  },
  responseType: 'stream'
});

response.data.on('data', (chunk) => {
  process.stdout.write(chunk.toString());
});

response.data.on('end', () => {
  console.log('\nStream completed');
});
```

## 🔍 Troubleshooting

### Check if services are running
```bash
sudo docker compose ps
sudo systemctl status home-ai-api.service
```

### View detailed logs
```bash
sudo docker compose logs -f
sudo journalctl -u home-ai-api.service -f
```

### Test API connectivity
```bash
curl -s http://localhost:3000/api/nutrition \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"query": "test"}'
```

### Restart everything
```bash
sudo systemctl restart home-ai-api.service
```

## 📁 Project Structure

```
home-ai/
├── docker-compose.yml          # Docker Compose configuration
├── home-ai-api.service         # Systemd service file
├── test_api.sh                 # Bash test script
├── test_api.py                 # Python test script
├── README.md                   # This file
└── node-api/
    ├── server.js               # Main API server
    ├── package.json            # Node.js dependencies
    ├── Dockerfile              # Docker configuration
    └── .env                    # Environment variables
```

## 🔒 Security Notes

- Change the default API key in `node-api/.env`
- Consider using HTTPS in production
- Restrict network access if needed
- Regularly update Docker images

## 🚀 Auto-Start Verification

To verify auto-start is working:

1. **Reboot your system:**
   ```bash
   sudo reboot
   ```

2. **After reboot, check services:**
   ```bash
   sudo systemctl status home-ai-api.service
   sudo docker compose ps
   ```

3. **Test the API:**
   ```bash
   ./test_api.sh
   ```

## 📞 Support

If you encounter issues:

1. Check the logs: `sudo docker compose logs -f`
2. Verify services are running: `sudo docker compose ps`
3. Test API connectivity: `./test_api.sh`
4. Restart if needed: `sudo systemctl restart home-ai-api.service`

---

**Happy AI-ing! 🤖✨**
