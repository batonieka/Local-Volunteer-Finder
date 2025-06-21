// src/controllers/opportunityController.ts
import { Request, Response } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';

export const getAllOpportunities = async (req: Request, res: Response) => {
  try {
    const opportunities = await readDataFromFile();
    
    const keyword = req.query.keyword?.toString().toLowerCase();
    const type = req.query.type?.toString().toLowerCase();
    const status = req.query.status?.toString() as 'open' | 'full' | 'completed';
    const sortBy = req.query.sortBy?.toString();
    const order = req.query.order?.toString() || 'asc';

    let filtered = opportunities;

    // Apply keyword filter
    if (keyword) {
      filtered = filtered.filter(op =>
        op.title.toLowerCase().includes(keyword) ||
        op.description.toLowerCase().includes(keyword) ||
        op.location.toLowerCase().includes(keyword) ||
        op.requiredSkills.some(skill => skill.toLowerCase().includes(keyword))
      );
    }

    // Apply type filter
    if (type) {
      filtered = filtered.filter(op => op.type.toLowerCase() === type);
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter(op => op.status === status);
    }

    // Apply sorting
    if (sortBy === 'date' || sortBy === 'title') {
      filtered.sort((a, b) => {
        let aVal: string;
        let bVal: string;
        
        if (sortBy === 'date') {
          aVal = a.date;
          bVal = b.date;
        } else {
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
        }
        
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

    // Validate required fields
    if (
      typeof title !== 'string' || title.trim() === '' ||
      typeof description !== 'string' || description.trim() === '' ||
      typeof date !== 'string' || date.trim() === '' ||
      typeof location !== 'string' || location.trim() === '' ||
      typeof type !== 'string' || type.trim() === ''
    ) {
      return res.status(400).json({ 
        error: "Title, description, date, location, and type must be non-empty strings." 
      });
    }

    // Validate optional fields
    if (requiredSkills && (!Array.isArray(requiredSkills) || 
        !requiredSkills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ 
        error: "requiredSkills must be an array of strings." 
      });
    }

    if (status && !['open', 'full', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: "status must be 'open', 'full', or 'completed'." 
      });
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
    const { id } = req.params;
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    const { title, description, date, location, type, requiredSkills, status } = req.body;

    // Validate required fields
    if (
      typeof title !== 'string' || title.trim() === '' ||
      typeof description !== 'string' || description.trim() === '' ||
      typeof date !== 'string' || date.trim() === '' ||
      typeof location !== 'string' || location.trim() === '' ||
      typeof type !== 'string' || type.trim() === ''
    ) {
      return res.status(400).json({ 
        error: "Title, description, date, location, and type must be non-empty strings." 
      });
    }

    // Validate optional fields
    if (requiredSkills && (!Array.isArray(requiredSkills) || 
        !requiredSkills.every(skill => typeof skill === 'string'))) {
      return res.status(400).json({ 
        error: "requiredSkills must be an array of strings." 
      });
    }

    if (status && !['open', 'full', 'completed'].includes(status)) {
      return res.status(400).json({ 
        error: "status must be 'open', 'full', or 'completed'." 
      });
    }

    const updatedOpportunity: VolunteerOpportunity = {
      id,
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      location: location.trim(),
      type: type.trim(),
      requiredSkills: requiredSkills || opportunities[index].requiredSkills,
      status: status || opportunities[index].status
    };

    opportunities[index] = updatedOpportunity;
    await writeDataToFile(opportunities);

    res.status(200).json(updatedOpportunity);
  } catch (error) {
    console.error('Error in updateOpportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOpportunity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    opportunities.splice(index, 1);
    await writeDataToFile(opportunities);

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteOpportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};