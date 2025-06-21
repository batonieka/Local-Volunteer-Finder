import { Request, Response } from "express";
import { VolunteerOpportunity } from "../types";
import { readDataFromFile, writeDataToFile } from "../utils/fileUtils";

export const getAllOpportunities = async (req: Request, res: Response) => {
  const keyword = req.query.keyword?.toString().toLowerCase();
  const type = req.query.type?.toString().toLowerCase();
  const sortBy = req.query.sortBy?.toString();
  const order = req.query.order?.toString() || 'asc';
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  let opportunities: VolunteerOpportunity[] = await readDataFromFile();
  let filtered = [...opportunities];

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
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      return order === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  res.json({
    page,
    limit,
    totalItems,
    totalPages,
    data: paginated
  });
};

export const getOpportunityById = async (req: Request, res: Response) => {
  const opportunities = await readDataFromFile();
  const found = opportunities.find(op => op.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Opportunity not found' });
  res.json(found);
};

export const createOpportunity = async (req: Request, res: Response) => {
  const { title, description, date, location, type, requiredSkills, status } = req.body;

  if (!title || !description || !date || !location || !type || !Array.isArray(requiredSkills) || !status) {
    return res.status(400).json({ error: "Missing or invalid required fields" });
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

  const opportunities = await readDataFromFile();
  opportunities.push(newOpportunity);
  await writeDataToFile(opportunities);

  res.status(201).json(newOpportunity);
};

export const updateOpportunity = async (req: Request, res: Response) => {
  const { title, description, date, location, type, requiredSkills, status } = req.body;

  if (!title || !description || !date || !location || !type || !Array.isArray(requiredSkills) || !status) {
    return res.status(400).json({ error: "Missing or invalid required fields" });
  }

  const opportunities = await readDataFromFile();
  const index = opportunities.findIndex(op => op.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Opportunity not found' });

  const updated: VolunteerOpportunity = {
    id: opportunities[index].id,
    title,
    description,
    date,
    location,
    type,
    requiredSkills,
    status
  };

  opportunities[index] = updated;
  await writeDataToFile(opportunities);

  res.json(updated);
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  const opportunities = await readDataFromFile();
  const index = opportunities.findIndex(op => op.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Opportunity not found' });

  opportunities.splice(index, 1);
  await writeDataToFile(opportunities);

  res.status(204).send();
};
