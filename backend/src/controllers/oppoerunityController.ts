// Task 1: Refactor /opportunities route into controller

// Create: src/controllers/opportunityController.ts
import { Request, Response } from 'express';
import { opportunities } from '../data/opportunities';

export const getAllOpportunities = (req: Request, res: Response) => {
  const keyword = req.query.keyword?.toString().toLowerCase();
  const type = req.query.type?.toString().toLowerCase();
  const sortBy = req.query.sortBy?.toString();
  const order = req.query.order?.toString() || 'asc';

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

  if (sortBy === 'date' || sortBy === 'title') {
    filtered = filtered.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return order === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
    });
  }

  res.json(filtered);
};

// Task 2: Implement GET Endpoint for a Single Opportunity

export const getOpportunityById = (req: Request, res: Response) => {
  const opportunity = opportunities.find(op => op.id === req.params.id);

  if (!opportunity) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  res.json(opportunity);
};
