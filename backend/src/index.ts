import express from "express";
import cors from "cors";
import { loadEnv } from "./utils/env";
import { askStructured } from "./ask-core";

loadEnv();
const app = express();
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "OPTIONS", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  }),
);

app.use(express.json());
app.post("/ask", async (req, res) => {
  try {
    const { query, size, difficulty } = req.body ?? {};
    const normalizedQuery = String(query ?? "").trim();
    const normalizedSize = Math.min(Math.max(Number(size ?? 5), 3), 15);
    const normalizedDifficulty = String(difficulty ?? "easy").trim() || "easy";

    if (!normalizedQuery) {
      return res.status(400).json({ error: "query is required" });
    }

    const questions = await askStructured(
      normalizedQuery,
      normalizedSize,
      normalizedDifficulty,
    );

    return res.status(200).json({
      questions,
      meta: {
        query: normalizedQuery,
        size: normalizedSize,
        difficulty: normalizedDifficulty,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("POST /ask failed:", err);
    return res.status(500).json({
      error: err?.message || "failed to answer",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
