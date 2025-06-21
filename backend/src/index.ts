import express from 'express';
import cors from 'cors';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity // ✅ New
} from './controllers/opportunityController';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/opportunities", getAllOpportunities);
app.get("/opportunities/:id", getOpportunityById);
app.post("/opportunities", createOpportunity);
app.put("/opportunities/:id", updateOpportunity); // ✅ PUT route

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
