export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  requiredSkills: string[]; // New
  status: 'open' | 'full' | 'completed'; // New
}
