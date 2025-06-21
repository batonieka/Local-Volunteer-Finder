import express from 'express';
import cors from 'cors';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity
} from './controllers/opportunityController';

const app = express();
app.use(cors());
app.use(express.json()); // ✅ Required to read req.body

const PORT = 3000;

app.get("/opportunities", getAllOpportunities);
app.get("/opportunities/:id", getOpportunityById);
app.post("/opportunities", createOpportunity); // ✅ Task 5

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
