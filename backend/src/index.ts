import express from 'express';
import cors from 'cors';

// Import the controller functions
import {
  getAllOpportunities,
  getOpportunityById
} from './controllers/opportunityController';

const app = express();
app.use(cors());

const PORT = 3000;

// ✅ Task 1: List all opportunities (with filtering support)
app.get("/opportunities", getAllOpportunities);

// ✅ Task 2: Get a single opportunity by ID
app.get("/opportunities/:id", getOpportunityById);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
