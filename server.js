const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* =========================
   STATIC FILES (Frontend)
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   JSON API (Game Backend)
========================= */

// Beispiel: Character Stats
app.get("/api/stats", (req, res) => {
  res.json({
    level: 27,
    class: "Metal Drummer / Developer",
    stats: {
      programming: 85,
      drumming: 95,
      devops: 70,
      problemSolving: 90
    }
  });
});

// Beispiel: Quests / Projekte
app.get("/api/quests", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Blast Beat Trainer",
      difficulty: "EPIC",
      tech: ["Next.js", "Web Audio API", "PostgreSQL"],
      status: "in-progress"
    },
    {
      id: 2,
      name: "MTG Deck Analyzer",
      difficulty: "RARE",
      tech: ["Node.js", "React", "API"],
      status: "completed"
    }
  ]);
});

// Beispiel: Inventory
app.get("/api/inventory", (req, res) => {
  res.json([
    { name: "Drum Kit", type: "instrument" },
    { name: "Laptop", type: "hardware" },
    { name: "Obsidian Vault", type: "software" },
    { name: "MTG Decks", type: "game" }
  ]);
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});