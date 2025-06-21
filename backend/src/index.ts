import express from 'express';
import cors from 'cors';

import { getAllOpportunities } from './controllers/opportunityController';

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/opportunities", getAllOpportunities);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
