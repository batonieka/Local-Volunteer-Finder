import fs from 'fs/promises';
import path from 'path';
import { VolunteerOpportunity } from '../types';

const filePath = path.join(process.cwd(), 'src', 'data', 'opportunities.json');

export async function readDataFromFile(): Promise<VolunteerOpportunity[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading file:", err);
    return [];
  }
}

export async function writeDataToFile(data: VolunteerOpportunity[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing file:", err);
    throw err;
  }
}