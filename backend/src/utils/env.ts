import dotenv from "dotenv";
import path from "path";
import fs from "fs";

let loaded = false;

export function loadEnv(): void {
  if (loaded) return;

  const searchRoots = [
    process.cwd(),
    path.resolve(process.cwd(), "src"),
    path.resolve(process.cwd(), "backend"),
    path.resolve(process.cwd(), "backend", "src"),
  ];
  const candidateFiles = [".env.local", ".env", "env"];

  for (const root of searchRoots) {
    for (const file of candidateFiles) {
      const fullPath = path.resolve(root, file);
      if (fs.existsSync(fullPath)) {
        dotenv.config({ path: fullPath });
        loaded = true;
        return;
      }
    }
  }

  loaded = true;
}
