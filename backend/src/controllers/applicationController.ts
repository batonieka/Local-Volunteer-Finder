import { Request, Response, NextFunction } from 'express';
import { VolunteerApplication } from '../types';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { logger } from '../utils/logger';

const APPLICATIONS_FILE = 'data/applications.json';

export const submitApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { opportunityId, name, email, message } = req.body;

    if (!opportunityId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Read applications from the specific file, or initialize empty array if file doesn't exist
    let applications: VolunteerApplication[] = [];
    try {
      const data = await readDataFromFile(APPLICATIONS_FILE);
      applications = data as VolunteerApplication[];
    } catch (error) {
      // File doesn't exist yet, start with empty array
      applications = [];
    }

    const newApplication: VolunteerApplication = {
      id: Date.now().toString(),
      opportunityId,
      name,
      email,
      message: message || '',
      submittedAt: new Date().toISOString(),
    };

    applications.push(newApplication);
    await writeDataToFile(applications, APPLICATIONS_FILE);

    logger.info(`Application submitted for opportunity ${opportunityId}`);
    res.status(201).json(newApplication);
  } catch (error) {
    logger.error('Error submitting application', error);
    next(error);
  }
};

export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let applications: VolunteerApplication[] = [];
    try {
      const data = await readDataFromFile(APPLICATIONS_FILE);
      applications = data as VolunteerApplication[];
    } catch (error) {
      // File doesn't exist yet, return empty array
      applications = [];
    }
    
    res.json(applications);
  } catch (error) {
    next(error);
  }
};