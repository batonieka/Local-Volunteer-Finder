import express from "express";
import cors from "cors";

import { opportunities } from "./data/opportunities";

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/opportunities", (req, res) => {
  const keyword = req.query.keyword?.toString().toLowerCase();
  const type = req.query.type?.toString().toLowerCase();

  let filtered = opportunities;

  if (keyword) {
    filtered = filtered.filter(op =>
      op.title.toLowerCase().includes(keyword) ||
      op.description.toLowerCase().includes(keyword)
    );
  }

  if (type) {
    filtered = filtered.filter(op => op.type.toLowerCase() === type);
  }

  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
