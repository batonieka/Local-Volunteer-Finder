import express from "express";
import { opportunities } from "./data/opportunities";

const app = express();
const PORT = 3000;

app.get("/opportunities", (req, res) => {
  res.json(opportunities);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
