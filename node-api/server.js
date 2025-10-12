import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Available models
const LLM = {
  llama3: "llama3",
  llama3_2_vision: "llama3.2-vision:11b",
  mistral: "mistral",

  mistral_vision: "mistral-vision:7b", // not pulled
  qwen: "qwen2.5-coder:14b", // not pulled
  qwen_vision: "qwen2.5-coder-vision:14b", // not pulled
  qwen_2_5_coder: "qwen2.5-coder:14b", // not pulled
  qwen_2_5_coder_vision: "qwen2.5-coder-vision:14b", // not pulled
};

const API_KEY = process.env.API_KEY;
const NUTRITION_MODEL = LLM.llama3_2_vision;
const HOME_ASSISTANT_MODEL = LLM.llama3_2_vision;
const GENERIC_MODEL = LLM.llama3_2_vision;
const OLLAMA_URL = "http://home-ai-ollama:11434/api/generate";

// Middleware for authentication
function authenticate(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  if (!clientKey || clientKey !== API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API key" });
  }
  next();
}

// Nutrition endpoint
app.post("/api/nutrition", authenticate, async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: NUTRITION_MODEL,
      prompt: query,
      stream: false
    });

    const output = response.data.response;

    res.json({ result: output });
  } catch (err) {
    console.error("Ollama request error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Ollama request failed", details: err.message });
  }
});

// Home Assistant endpoint
app.post("/api/home-assistant", authenticate, async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: HOME_ASSISTANT_MODEL,
      prompt: `You are a helpful AI home assistant.
      User: ${message}`,
      stream: false
    });

    const output = response.data.response;

    res.json({ reply: output });
  } catch (err) {
    console.error("Ollama request error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Ollama request failed", details: err.message });
  }
});

// Generic AI endpoint
app.post("/api/ai", authenticate, async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: GENERIC_MODEL,
      prompt: query,
      stream: false
    });

    const output = response.data.response;

    res.json({ result: output });
  } catch (err) {
    console.error("Ollama request error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Ollama request failed", details: err.message });
  }
});

// Generic Stream endpoint
app.post("/api/ai/stream", authenticate, async (req, res) => {
  const { query, system_prompt = "", character_name = "" } = req.body;

  const prompt = `
  ${system_prompt}
  ${character_name}
  ${query}
  `;

  try {
    // Set headers for streaming response
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const response = await axios.post(OLLAMA_URL, {
      model: GENERIC_MODEL,
      prompt: prompt,
      stream: true
    }, {
      responseType: 'stream'
    });

    // Stream the response from Ollama to the client
    response.data.on('data', (chunk) => {
      try {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.trim()) {
            const data = JSON.parse(line);
            if (data.response) {
              res.write(data.response);
            }
            if (data.done) {
              res.end();
              return;
            }
          }
        }
      } catch (parseErr) {
        console.error('Error parsing streaming response:', parseErr);
      }
    });

    response.data.on('end', () => {
      res.end();
    });

    response.data.on('error', (streamErr) => {
      console.error('Stream error:', streamErr);
      res.status(500).end('Stream error occurred');
    });

  } catch (err) {
    console.error("Ollama request error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ error: "Ollama request failed", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("Ollama API server running on http://localhost:3000");
});
