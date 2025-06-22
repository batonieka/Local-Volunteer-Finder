import { Request, Response, NextFunction } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { validateOpportunityInput } from '../utils/validateOpportunity';
import { opportunitySchema } from '../validation/opportunitySchema';

// GET /opportunities
export const getAllOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();

    const keyword = req.query.keyword?.toString().toLowerCase();
    const type = req.query.type?.toString().toLowerCase();
    const status = req.query.status as VolunteerOpportunity["status"];
    const sortBy = req.query.sortBy?.toString();
    const order = req.query.order?.toString() === "desc" ? "desc" : "asc";

    const page = parseInt(req.query.page?.toString() || "1");
    const limit = parseInt(req.query.limit?.toString() || "10");

    let filtered = opportunities;

    // 🔍 Filtering
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

    // 📊 Sorting
    if (sortBy === "date") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === "desc" ? dateB - dateA : dateA - dateB;
      });
    } else if (sortBy === "title") {
      filtered.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return order === "desc" ? titleB.localeCompare(titleA) : titleA.localeCompare(titleB);
      });
    }

    // 📄 Pagination
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
    const result = opportunitySchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      return res.status(400).json({ errors });
    }

    const data = result.data;

    const opportunities = await readDataFromFile();
    const newOpportunity: VolunteerOpportunity = {
      id: Date.now().toString(),
      ...data,
      requiredSkills: data.requiredSkills || [],
      status: data.status || 'open',
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

    const merged = {
      ...opportunities[index],
      ...req.body,
    };

    const result = opportunitySchema.safeParse(merged);

    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      return res.status(400).json({ errors });
    }

    const validatedData = result.data;

    const updatedOpportunity: VolunteerOpportunity = {
      id: req.params.id,
      title: validatedData.title,
      description: validatedData.description,
      date: validatedData.date,
      location: validatedData.location,
      type: validatedData.type,
      status: validatedData.status ?? "open",
      requiredSkills: validatedData.requiredSkills ?? [],
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
