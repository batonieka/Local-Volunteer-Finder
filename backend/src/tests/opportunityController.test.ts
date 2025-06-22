// src/tests/opportunityController.test.ts
import request from 'supertest';
import express from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} from '../controllers/opportunityController';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';

const app = express();
app.use(express.json());

app.get('/opportunities', getAllOpportunities);
app.get('/opportunities/:id', getOpportunityById);
app.post('/opportunities', createOpportunity);
app.put('/opportunities/:id', updateOpportunity);
app.delete('/opportunities/:id', deleteOpportunity);

describe('Opportunity Controller – Advanced Coverage', () => {
  let id: string;

  beforeEach(async () => {
    await writeDataToFile([]); // reset before each test
  });

  it('should create a new opportunity', async () => {
    const res = await request(app).post('/opportunities').send({
      title: 'Help Kids',
      description: 'Tutoring children',
      date: '2025-08-01',
      location: 'Tbilisi',
      type: 'Education',
      requiredSkills: ['Patience', 'Teaching'],
      status: 'open'
    });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    id = res.body.id;
  });

  it('should return all opportunities with pagination', async () => {
    const res = await request(app).get('/opportunities?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.pagination).toHaveProperty('page');
  });

  it('should filter by status', async () => {
    await request(app).post('/opportunities').send({
      title: 'Beach Cleanup',
      description: 'Environmental effort',
      date: '2025-09-01',
      location: 'Batumi',
      type: 'Environmental',
      status: 'completed',
      requiredSkills: []
    });

    const res = await request(app).get('/opportunities?status=completed');
    expect(res.body.data.every(op => op.status === 'completed')).toBe(true);
  });

  it('should sort by title descending', async () => {
    await request(app).post('/opportunities').send({
      title: 'Zoo Volunteering',
      description: 'Feed animals',
      date: '2025-10-01',
      location: 'Zoo',
      type: 'Animal care',
      requiredSkills: ['Responsibility']
    });

    const res = await request(app).get('/opportunities?sortBy=title&order=desc');
    const titles = res.body.data.map(o => o.title);
    const sorted = [...titles].sort((a, b) => b.localeCompare(a));
    expect(titles).toEqual(sorted);
  });

  it('should return 404 for unknown ID', async () => {
    const res = await request(app).get('/opportunities/nonexistent-id');
    expect(res.status).toBe(404);
  });

  it('should return error for invalid POST data', async () => {
    const res = await request(app).post('/opportunities').send({
      title: '',
      description: '',
      date: '',
      location: '',
      type: ''
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return error for invalid status or skills on update', async () => {
    const created = await request(app).post('/opportunities').send({
      title: 'Park Work',
      description: 'Plant trees',
      date: '2025-07-01',
      location: 'Rustavi',
      type: 'Environmental'
    });

    const updateRes = await request(app)
      .put(`/opportunities/${created.body.id}`)
      .send({
        status: 'invalid-status',
        requiredSkills: ['Gardening', 123] // invalid mixed type
      });

    expect(updateRes.status).toBe(400);
    expect(updateRes.body.errors).toContainEqual(
      expect.stringContaining('Invalid status')
    );
  });

  it('should delete an opportunity', async () => {
    const post = await request(app).post('/opportunities').send({
      title: 'Library',
      description: 'Sort books',
      date: '2025-08-15',
      location: 'Library',
      type: 'Community'
    });

    const del = await request(app).delete(`/opportunities/${post.body.id}`);
    expect(del.status).toBe(204);

    const check = await request(app).get(`/opportunities/${post.body.id}`);
    expect(check.status).toBe(404);
  });
});
