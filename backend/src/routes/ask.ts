import { Router } from "express";
import { askStructured } from "../services/ask.service";

export const askRouter = Router();

askRouter.post("/", async (req, res) => {
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
  } catch (error) {
    console.error("POST /ask failed:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "failed to answer",
    });
  }
});
