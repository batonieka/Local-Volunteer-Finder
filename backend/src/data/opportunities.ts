// src/data/opportunities.ts
import { VolunteerOpportunity } from "../types";

export const opportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Park Cleanup",
    description: "Help clean up the local park.",
    date: "2025-06-10",
    location: "Central Park",
    type: "environmental"
  },
  {
    id: "2",
    title: "Tutoring Kids",
    description: "Tutor elementary school children in math and reading.",
    date: "2025-06-12",
    location: "Community Center",
    type: "education"
  },
  {
    id: "3",
    title: "Food Bank Assistant",
    description: "Help sort and distribute food to families in need.",
    date: "2025-06-15",
    location: "City Food Bank",
    type: "social_service"
  },
  {
    id: "4",
    title: "Animal Shelter Helper",
    description: "Walk dogs, clean kennels, and help care for rescued animals.",
    date: "2025-06-18",
    location: "Happy Paws Shelter",
    type: "animal_care"
  },
  {
    id: "5",
    title: "Beach Cleanup",
    description: "Join us to remove trash and debris from the local beach.",
    date: "2025-06-20",
    location: "Sunset Beach",
    type: "environmental"
  }
];