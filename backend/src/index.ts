import express from 'express';
import cors from 'cors';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} from './controllers/opportunityController';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/opportunities', getAllOpportunities);
app.get('/opportunities/:id', getOpportunityById);
app.post('/opportunities', createOpportunity);
app.put('/opportunities/:id', updateOpportunity);
app.delete('/opportunities/:id', deleteOpportunity);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
