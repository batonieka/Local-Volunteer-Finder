import { Request, Response } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';

export const getAllOpportunities = async (req: Request, res: Response) => {
  try {
    const opportunities = await readDataFromFile();

    const keyword = req.query.keyword?.toString().toLowerCase();
    const type = req.query.type?.toString().toLowerCase();
    const status = req.query.status?.toString() as VolunteerOpportunity["status"];
    const sortBy = req.query.sortBy?.toString();
    const order = req.query.order?.toString() || 'asc';

    let filtered = opportunities;

    if (keyword) {
      filtered = filtered.filter(op =>
        op.title.toLowerCase().includes(keyword) ||
        op.description.toLowerCase().includes(keyword) ||
        op.location.toLowerCase().includes(keyword) ||
        op.requiredSkills.some(skill => skill.toLowerCase().includes(keyword))
      );
    }

    if (type) {
      filtered = filtered.filter(op => op.type.toLowerCase() === type);
    }

    if (status) {
      filtered = filtered.filter(op => op.status === status);
    }

    if (sortBy === 'date' || sortBy === 'title') {
      filtered.sort((a, b) => {
        const aVal = sortBy === 'date' ? a.date : a.title.toLowerCase();
        const bVal = sortBy === 'date' ? b.date : b.title.toLowerCase();
        return order === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      });
    }

    res.json(filtered);
  } catch (error) {
    console.error('Error in getAllOpportunities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const opportunities = await readDataFromFile();
    const opportunity = opportunities.find(op => op.id === req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    console.error('Error in getOpportunityById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const { title, description, date, location, type, requiredSkills, status } = req.body;

    if (
      typeof title !== 'string' || !title.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof date !== 'string' || !date.trim() ||
      typeof location !== 'string' || !location.trim() ||
      typeof type !== 'string' || !type.trim()
    ) {
      return res.status(400).json({ error: "Missing or invalid required fields." });
    }

    if (requiredSkills && (!Array.isArray(requiredSkills) || !requiredSkills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ error: "requiredSkills must be an array of strings." });
    }

    if (status && !['open', 'full', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const opportunities = await readDataFromFile();

    const newOpportunity: VolunteerOpportunity = {
      id: Date.now().toString(),
      title,
      description,
      date,
      location,
      type,
      requiredSkills: requiredSkills || [],
      status: status || 'open'
    };

    opportunities.push(newOpportunity);
    await writeDataToFile(opportunities);

    res.status(201).json(newOpportunity);
  } catch (error) {
    console.error('Error in createOpportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOpportunity = async (req: Request, res: Response) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const { title, description, date, location, type, requiredSkills, status } = req.body;

    const updated: VolunteerOpportunity = {
      id: req.params.id,
      title: title || opportunities[index].title,
      description: description || opportunities[index].description,
      date: date || opportunities[index].date,
      location: location || opportunities[index].location,
      type: type || opportunities[index].type,
      requiredSkills: requiredSkills || opportunities[index].requiredSkills,
      status: status || opportunities[index].status
    };

    opportunities[index] = updated;
    await writeDataToFile(opportunities);

    res.json(updated);
  } catch (error) {
    console.error('Error in updateOpportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    opportunities.splice(index, 1);
    await writeDataToFile(opportunities);

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteOpportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
