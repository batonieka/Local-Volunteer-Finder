// src/tests/opportunityController.test.ts
import request from 'supertest';
import express from 'express';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '../controllers/opportunityController';

const app = express();
app.use(express.json());
app.get('/opportunities', getAllOpportunities);
app.get('/opportunities/:id', getOpportunityById);
app.post('/opportunities', createOpportunity);
app.put('/opportunities/:id', updateOpportunity);
app.delete('/opportunities/:id', deleteOpportunity);

describe('Opportunity Controller', () => {
  let opportunityId: string;

  beforeAll(async () => {
    await writeDataToFile([]); // Clean up before tests
  });

  it('should create a new opportunity', async () => {
    const response = await request(app).post('/opportunities').send({
      title: 'Clean Beach',
      description: 'Pick up trash on the beach',
      date: '2025-07-01',
      location: 'Batumi',
      type: 'environment',
      requiredSkills: ['physical stamina'],
      status: 'open'
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    opportunityId = response.body.id;
  });

  it('should get all opportunities', async () => {
    const response = await request(app).get('/opportunities');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should get opportunity by id', async () => {
    const response = await request(app).get(`/opportunities/${opportunityId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(opportunityId);
  });

  it('should update the opportunity', async () => {
    const response = await request(app).put(`/opportunities/${opportunityId}`).send({
      title: 'Updated Title',
      description: 'Updated desc',
      date: '2025-08-01',
      location: 'Kutaisi',
      type: 'education',
      requiredSkills: ['creativity'],
      status: 'open'
    });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });

  it('should delete the opportunity', async () => {
    const response = await request(app).delete(`/opportunities/${opportunityId}`);
    expect(response.status).toBe(204);
  });

  it('should return 404 for deleted opportunity', async () => {
    const response = await request(app).get(`/opportunities/${opportunityId}`);
    expect(response.status).toBe(404);
  });
});
