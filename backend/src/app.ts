import cors from "cors";
import express from "express";
import { askRouter } from "./routes/ask";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["POST", "GET", "OPTIONS", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: false,
    }),
  );

  app.use(express.json());
  app.use("/ask", askRouter);

  return app;
}
