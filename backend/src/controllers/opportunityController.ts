import { Request, Response, NextFunction } from 'express';
import { VolunteerOpportunity } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { opportunitySchema } from '../validation/opportunitySchema';
import { logger } from '../utils/logger'; // Winston logger
import { sendEmailStub } from '../utils/emailService'; // Email stub
import Fuse from 'fuse.js';

// GET /opportunities
export const getAllOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();

    const keyword = req.query.keyword?.toString().toLowerCase();
    const type = req.query.type?.toString().toLowerCase();
    const status = req.query.status?.toString() as VolunteerOpportunity['status'];
    const sortBy = req.query.sortBy?.toString();
    const order = req.query.order?.toString() || 'asc';
    const showExpired = req.query.showExpired?.toString() === 'true';

    const startDateStr = req.query.startDate?.toString();
    const endDateStr = req.query.endDate?.toString();
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    const page = parseInt(req.query.page?.toString() || '1');
    const limit = parseInt(req.query.limit?.toString() || '10');

    const now = new Date();

    let filtered = opportunities;

    if (keyword) {
      const fuse = new Fuse(opportunities, {
        keys: ['title', 'description', 'location', 'requiredSkills'],
        threshold: 0.4,
        includeScore: false,
      });
      const searchResults = fuse.search(keyword).map(result => result.item);
      filtered = searchResults;
    }

    if (type) {
      filtered = filtered.filter(op => op.type.toLowerCase() === type);
    }

    if (status) {
      filtered = filtered.filter(op => op.status === status);
    }

    if (startDate || endDate) {
      filtered = filtered.filter(op => {
        const opportunityDate = new Date(op.date);
        if (startDate && opportunityDate < startDate) return false;
        if (endDate && opportunityDate > endDate) return false;
        return true;
      });
    }

    if (!showExpired) {
      filtered = filtered.filter(op => new Date(op.date) >= now);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return order === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title) * (order === 'desc' ? -1 : 1));
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    logger.info(`Fetched ${paginatedResults.length} opportunities (Page ${page}/${Math.ceil(filtered.length / limit)})`);

    res.json({
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error(`Failed to fetch opportunities: ${(error as Error).message}`);
    next(error);
  }
};

// GET /opportunities/:id
// In getOpportunityById inside opportunityController.ts
export const getOpportunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);

    if (index === -1) {
      logger.warn(`Opportunity not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    //  Increment view count
    opportunities[index].views = (opportunities[index].views || 0) + 1;
    await writeDataToFile(opportunities);

    logger.info(`Viewed opportunity ID: ${req.params.id} (Views: ${opportunities[index].views})`);
    res.json(opportunities[index]);
  } catch (error) {
    logger.error(`Error fetching opportunity by ID: ${(error as Error).message}`);
    next(error);
  }
};


// POST /opportunities
export const createOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = opportunitySchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      logger.warn(`Validation failed for new opportunity: ${errors.join(', ')}`);
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

    // 🔔 Simulate sending email
    sendEmailStub({
      to: 'admin@example.com',
      subject: 'New Opportunity Created',
      message: `
A new opportunity has been created:

📝 Title: ${newOpportunity.title}
📍 Location: ${newOpportunity.location}
📆 Date: ${newOpportunity.date}
🔖 Type: ${newOpportunity.type}
📌 Status: ${newOpportunity.status}
      `
    });

    logger.info(`Created new opportunity: ${newOpportunity.id}`);
    res.status(201).json(newOpportunity);
  } catch (error) {
    logger.error(`Failed to create opportunity: ${(error as Error).message}`);
    next(error);
  }
};

// PUT /opportunities/:id
export const updateOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);

    if (index === -1) {
      logger.warn(`Update failed - opportunity not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const merged = {
      ...opportunities[index],
      ...req.body,
    };

    const result = opportunitySchema.safeParse(merged);
    if (!result.success) {
      const errors = result.error.errors.map(e => e.message);
      logger.warn(`Validation failed for update: ${errors.join(', ')}`);
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

    logger.info(`Updated opportunity ID: ${req.params.id}`);
    res.json(updatedOpportunity);
  } catch (error) {
    logger.error(`Error updating opportunity: ${(error as Error).message}`);
    next(error);
  }
};

// DELETE /opportunities/:id
export const deleteOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const index = opportunities.findIndex(op => op.id === req.params.id);

    if (index === -1) {
      logger.warn(`Delete failed - opportunity not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    opportunities.splice(index, 1);
    await writeDataToFile(opportunities);

    logger.info(`Deleted opportunity ID: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting opportunity: ${(error as Error).message}`);
    next(error);
  }
};

// GET /opportunities/categories
export const getOpportunityCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query.keyword?.toString().toLowerCase();
    const opportunities = await readDataFromFile();

    const categoriesSet = new Set<string>();

    opportunities.forEach(op => {
      if (!op.type) return;
      const type = op.type.trim();
      if (!keyword || type.toLowerCase().includes(keyword)) {
        categoriesSet.add(type);
      }
    });

    const categories = Array.from(categoriesSet).sort((a, b) => a.localeCompare(b));

    logger.info(`Fetched ${categories.length} opportunity categories`);
    res.json({ categories });
  } catch (error) {
    logger.error(`Failed to fetch opportunity categories: ${(error as Error).message}`);
    next(error);
  }
};
// Add to opportunityController.ts
export const getTopViewedOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const opportunities = await readDataFromFile();
    const sorted = opportunities
      .slice()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);

    res.json({ topViewed: sorted });
  } catch (error) {
    next(error);
  }
};
