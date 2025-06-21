import { Request, Response } from 'express';
import { opportunities } from '../data/opportunities';
import { VolunteerOpportunity } from '../types';

export const createOpportunity = (req: Request, res: Response) => {
  const { title, description, date, location, type } = req.body;

  // Basic validation (detailed validation is Task 5)
  if (!title || !description || !date || !location || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newOpportunity: VolunteerOpportunity = {
    id: Date.now().toString(),
    title,
    description,
    date,
    location,
    type,
  };

  opportunities.push(newOpportunity);

  res.status(201).json(newOpportunity);
};
