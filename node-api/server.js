import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.API_KEY;
const NUTRITION_MODEL = "mistral";
const HOME_ASSISTANT_MODEL = "llama3";
const GENERIC_MODEL = "llama3";
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
  const { query } = req.body;
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: GENERIC_MODEL,
      prompt: query,
      stream: true
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
