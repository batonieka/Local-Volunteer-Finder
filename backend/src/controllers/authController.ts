import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
}

const usersFile = path.join(__dirname, '../data/users.json');

const readUsers = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeUsers = async (users: User[]) => {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await readUsers();
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: Date.now().toString(),
    username,
    email,
    password: hashed,
  };

  users.push(newUser);
  await writeUsers(users);

  logger.info(`User registered: ${email}`);
  res.status(201).json({ message: 'User registered successfully' });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const users = await readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '2h' }
  );

  res.json({ token });
};