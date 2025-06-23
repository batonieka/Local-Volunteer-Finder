export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  status: 'open' | 'closed' | 'completed';
  requiredSkills?: string[];
}

export interface VolunteerApplication {
  id: string;
  opportunityId: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}