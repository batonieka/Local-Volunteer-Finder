// src/tests/fileUtils.test.ts
import fs from 'fs/promises';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { VolunteerOpportunity } from '../types';

jest.mock('fs/promises');

describe('fileUtils', () => {
  const mockData: VolunteerOpportunity[] = [
    {
      id: "1",
      title: "Test",
      description: "Test Desc",
      date: "2025-07-01",
      location: "Test City",
      type: "Education",
      requiredSkills: ["Skill"],
      status: "open"
    }
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reads data from a file and returns parsed JSON', async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));
    const result = await readDataFromFile();
    expect(result).toEqual(mockData);
  });

  it('returns empty array if reading file fails', async () => {
    (fs.readFile as jest.Mock).mockRejectedValueOnce(new Error("File not found"));
    const result = await readDataFromFile();
    expect(result).toEqual([]);
  });

  it('writes data to a file successfully', async () => {
    await writeDataToFile(mockData);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockData, null, 2),
      'utf-8'
    );
  });

  it('throws error if writing to file fails', async () => {
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Write failed'));

    await expect(writeDataToFile(mockData)).rejects.toThrow('Write failed');
  });
});
