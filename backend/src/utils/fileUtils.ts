import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(__dirname, '../data/opportunities.json');

export const readDataFromFile = (): any[] => {
  const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(fileContent);
};

export const writeDataToFile = (data: any[]): void => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};
