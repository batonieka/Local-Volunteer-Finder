import fs from 'fs/promises';
import path from 'path';
import { VolunteerOpportunity, VolunteerApplication } from '../types';
import { logger } from '../utils/logger';

const opportunityPath = path.join(process.cwd(), 'src', 'data', 'opportunities.json');
const applicationPath = path.join(process.cwd(), 'src', 'data', 'applications.json');

export async function readDataFromFile(file: 'opportunities' | 'applications' = 'opportunities'): Promise<VolunteerOpportunity[] | VolunteerApplication[]> {
  const filePath = file === 'opportunities' ? opportunityPath : applicationPath;
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    logger.error(`Error reading ${file} file:`, err);
    return [];
  }
}

export async function writeDataToFile(data: VolunteerOpportunity[] | VolunteerApplication[], file: 'opportunities' | 'applications' = 'opportunities'): Promise<void> {
  const filePath = file === 'opportunities' ? opportunityPath : applicationPath;
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    logger.error(`Error writing ${file} file:`, err);
    throw err;
  }
}
