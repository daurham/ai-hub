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
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `You are a nutrition parser. 
      Input: "${query}"
      Output ONLY valid JSON with calories, protein, carbs, and fat.`,
    });

    let output = "";
    for (const line of response.data.output) {
      output += line.content;
    }

    res.json({ result: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ollama request failed" });
  }
});

// Assistant endpoint
app.post("/api/assistant", authenticate, async (req, res) => {
  const { message } = req.body;
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: `You are a helpful AI home assistant.
      User: ${message}`,
    });

    let output = "";
    for (const line of response.data.output) {
      output += line.content;
    }

    res.json({ reply: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ollama request failed" });
  }
});

app.listen(3000, () => {
  console.log("Ollama API server running on http://localhost:3000");
});
