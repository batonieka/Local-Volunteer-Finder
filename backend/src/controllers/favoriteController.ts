import { Request, Response, NextFunction } from 'express';
import { readDataFromFile, writeDataToFile } from '../utils/fileUtils';
import { VolunteerOpportunity } from '../types';

export const toggleFavoriteOpportunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const opportunityId = req.params.id;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const opportunities = await readDataFromFile();
    const opportunity = opportunities.find(op => op.id === opportunityId);

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    opportunity.favoritedBy = opportunity.favoritedBy || [];
    const isFavorite = opportunity.favoritedBy.includes(userId);

    if (isFavorite) {
      opportunity.favoritedBy = opportunity.favoritedBy.filter((id: string) => id !== userId);
    } else {
      opportunity.favoritedBy.push(userId);
    }

    await writeDataToFile(opportunities);
    res.status(200).json({
      id: opportunityId,
      favorited: !isFavorite,
    });
  } catch (error) {
    next(error);
  }
};

export const getFavoritesByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const opportunities = await readDataFromFile();
    const favorites = opportunities.filter(op => op.favoritedBy?.includes(userId));
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};