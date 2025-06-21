import { Request, Response } from 'express';
import { opportunities } from '../data/opportunities';

// Task 1: Get all opportunities
export const getAllOpportunities = (req: Request, res: Response) => {
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
};

// ✅ Task 2: Get opportunity by ID
export const getOpportunityById = (req: Request, res: Response) => {
  const opportunity = opportunities.find(op => op.id === req.params.id);

  if (!opportunity) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  res.json(opportunity);
};
