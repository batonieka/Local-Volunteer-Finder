import { Request, Response } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';

export const getAllOpportunities = (req: Request, res: Response) => {
  const keyword = req.query.keyword?.toString().toLowerCase();
  const type = req.query.type?.toString().toLowerCase();
  const sortBy = req.query.sortBy?.toString();
  const order = req.query.order?.toString() || 'asc';

  let opportunities = readDataFromFile();

  if (keyword) {
    opportunities = opportunities.filter(op =>
      op.title.toLowerCase().includes(keyword) ||
      op.description.toLowerCase().includes(keyword)
    );
  }

  if (type) {
    opportunities = opportunities.filter(op => op.type.toLowerCase() === type);
  }

  if (sortBy === 'date' || sortBy === 'title') {
    opportunities.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return order === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const paginated = opportunities.slice(startIndex, startIndex + limit);

  res.json(paginated);
};

export const getOpportunityById = (req: Request, res: Response) => {
  const opportunities = readDataFromFile();
  const found = opportunities.find(op => op.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Opportunity not found' });
  res.json(found);
};

export const createOpportunity = (req: Request, res: Response) => {
  const { title, description, date, location, type, requiredSkills, status } = req.body;

  if (!title || !description || !date || !location || !type || !Array.isArray(requiredSkills) || !status) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  const newOpportunity: VolunteerOpportunity = {
    id: Date.now().toString(),
    title,
    description,
    date,
    location,
    type,
    requiredSkills,
    status
  };

  const opportunities = readDataFromFile();
  opportunities.push(newOpportunity);
  writeDataToFile(opportunities);

  res.status(201).json(newOpportunity);
};

export const updateOpportunity = (req: Request, res: Response) => {
  const { title, description, date, location, type, requiredSkills, status } = req.body;

  if (!title || !description || !date || !location || !type || !Array.isArray(requiredSkills) || !status) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  const opportunities = readDataFromFile();
  const index = opportunities.findIndex(op => op.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  const updatedOpportunity: VolunteerOpportunity = {
    id: req.params.id,
    title,
    description,
    date,
    location,
    type,
    requiredSkills,
    status
  };

  opportunities[index] = updatedOpportunity;
  writeDataToFile(opportunities);

  res.status(200).json(updatedOpportunity);
};

export const deleteOpportunity = (req: Request, res: Response) => {
  const opportunities = readDataFromFile();
  const index = opportunities.findIndex(op => op.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  opportunities.splice(index, 1);
  writeDataToFile(opportunities);

  res.status(204).send();
};
