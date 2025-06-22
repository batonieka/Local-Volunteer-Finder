export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status?: 'open' | 'full' | 'completed';
  requiredSkills?: string[];
  favoritedBy?: string[]; // user IDs (e.g. 'user123')
}
