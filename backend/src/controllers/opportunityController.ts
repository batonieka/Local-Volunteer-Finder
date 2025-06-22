import { Request, Response, NextFunction } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { validateOpportunityInput } from '../utils/validateOpportunity';

// GET /opportunities
export const getAllOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();

    const keyword = req.query.keyword?.toString().toLowerCase();
    const type = req.query.type?.toString().toLowerCase();
    const status = req.query.status as VolunteerOpportunity["status"];
    const sortBy = req.query.sortBy?.toString();
    const order = req.query.order?.toString() || 'asc';

    const page = parseInt(req.query.page?.toString() || '1');
    const limit = parseInt(req.query.limit?.toString() || '10');

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

    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return order === 'desc' ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
      });
    }

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
    next(error);
  }
};

// GET /opportunities/:id
export const getOpportunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const opportunity = opportunities.find(op => op.id === req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// POST /opportunities
export const createOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const errors = validateOpportunityInput(data);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const opportunities = await readDataFromFile();
    const newOpportunity: VolunteerOpportunity = {
      id: Date.now().toString(),
      title: data.title.trim(),
      description: data.description.trim(),
      date: data.date.trim(),
      location: data.location.trim(),
      type: data.type.trim(),
      requiredSkills: data.requiredSkills || [],
      status: data.status || 'open'
    };

    opportunities.push(newOpportunity);
    await writeDataToFile(opportunities);

    res.status(201).json(newOpportunity);
  } catch (error) {
    next(error);
  }
};

// PUT /opportunities/:id
export const updateOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const updatedData = {
      ...opportunities[index],
      ...req.body
    };

    const errors = validateOpportunityInput(updatedData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedOpportunity: VolunteerOpportunity = {
      id: req.params.id,
      title: updatedData.title.trim(),
      description: updatedData.description.trim(),
      date: updatedData.date.trim(),
      location: updatedData.location.trim(),
      type: updatedData.type.trim(),
      requiredSkills: updatedData.requiredSkills,
      status: updatedData.status
    };

    opportunities[index] = updatedOpportunity;
    await writeDataToFile(opportunities);

    res.json(updatedOpportunity);
  } catch (error) {
    next(error);
  }
};

// DELETE /opportunities/:id
export const deleteOpportunity = async (req: Request, res: Response, next: NextFunction) => {
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
    next(error);
  }
};
