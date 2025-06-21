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
    
    // Pagination parameters
    const page = parseInt(req.query.page?.toString() || '1');
    const limit = parseInt(req.query.limit?.toString() || '10');

    let filtered = opportunities;

    // Filtering logic
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

    // Sorting logic
    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return order === 'desc' ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
      });
    }

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    res.json({
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1
      }
    });
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

    // Validation
    if (
      typeof title !== 'string' || !title.trim() ||
      typeof description !== 'string' || !description.trim() ||
      typeof date !== 'string' || !date.trim() ||
      typeof location !== 'string' || !location.trim() ||
      typeof type !== 'string' || !type.trim()
    ) {
      return res.status(400).json({ error: "Missing or invalid required fields: title, description, date, location, type are required." });
    }

    if (requiredSkills && (!Array.isArray(requiredSkills) || !requiredSkills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ error: "requiredSkills must be an array of strings." });
    }

    if (status && !['open', 'full', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'open', 'full', or 'completed'." });
    }

    const opportunities = await readDataFromFile();

    const newOpportunity: VolunteerOpportunity = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
      type: type.trim(),
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

    // Validation for provided fields
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({ error: "Title must be a non-empty string." });
    }
    if (description !== undefined && (typeof description !== 'string' || !description.trim())) {
      return res.status(400).json({ error: "Description must be a non-empty string." });
    }
    if (date !== undefined && (typeof date !== 'string' || !date.trim())) {
      return res.status(400).json({ error: "Date must be a non-empty string." });
    }
    if (location !== undefined && (typeof location !== 'string' || !location.trim())) {
      return res.status(400).json({ error: "Location must be a non-empty string." });
    }
    if (type !== undefined && (typeof type !== 'string' || !type.trim())) {
      return res.status(400).json({ error: "Type must be a non-empty string." });
    }
    if (requiredSkills !== undefined && (!Array.isArray(requiredSkills) || !requiredSkills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ error: "requiredSkills must be an array of strings." });
    }
    if (status !== undefined && !['open', 'full', 'completed'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'open', 'full', or 'completed'." });
    }

    const updated: VolunteerOpportunity = {
      id: req.params.id,
      title: title?.trim() || opportunities[index].title,
      description: description?.trim() || opportunities[index].description,
      date: date?.trim() || opportunities[index].date,
      location: location?.trim() || opportunities[index].location,
      type: type?.trim() || opportunities[index].type,
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