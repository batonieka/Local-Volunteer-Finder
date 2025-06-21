import { Request, Response } from 'express';
import { opportunities } from '../data/opportunities';

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
