export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  requiredSkills: string[]; // ✅ Add this line
  status: string;
}
