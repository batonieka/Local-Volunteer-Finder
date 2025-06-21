import { Request, Response } from 'express';
import { opportunities } from '../data/opportunities';
import { VolunteerOpportunity } from '../types';

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
    filtered.sort((a, b) => {
      const aVal = a[sortBy].toLowerCase();
      const bVal = b[sortBy].toLowerCase();
      return order === 'desc'
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    });
  }

  res.json(filtered);
};

export const getOpportunityById = (req: Request, res: Response) => {
  const opportunity = opportunities.find(op => op.id === req.params.id);

  if (!opportunity) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  res.json(opportunity);
};

export const createOpportunity = (req: Request, res: Response) => {
  const { title, description, date, location, type } = req.body;

  // ✅ Enhanced validation for required fields
  if (
    typeof title !== 'string' || title.trim() === '' ||
    typeof description !== 'string' || description.trim() === '' ||
    typeof date !== 'string' || date.trim() === '' ||
    typeof location !== 'string' || location.trim() === '' ||
    typeof type !== 'string' || type.trim() === ''
  ) {
    return res.status(400).json({ error: "All fields must be non-empty strings." });
  }

  const newOpportunity: VolunteerOpportunity = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description.trim(),
    date: date.trim(),
    location: location.trim(),
    type: type.trim()
  };

  opportunities.push(newOpportunity);

  res.status(201).json(newOpportunity);
};
