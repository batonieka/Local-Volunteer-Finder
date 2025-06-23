import fs from 'fs/promises';
import path from 'path';
import { VolunteerOpportunity } from '../types';

const DATA_FILE = 'data/opportunities.json';

export const readDataFromFile = async (filename?: string): Promise<VolunteerOpportunity[] | any[]> => {
  const filePath = filename || DATA_FILE;
  
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
};

export const writeDataToFile = async (data: any[], filename?: string): Promise<void> => {
  const filePath = filename || DATA_FILE;
  const dir = path.dirname(filePath);
  
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
};