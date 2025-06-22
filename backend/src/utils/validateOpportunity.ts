// utils/validateOpportunity.ts
import { VolunteerOpportunity } from "../types";

export function validateOpportunityInput(input: Partial<VolunteerOpportunity>): string[] {
  const errors: string[] = [];

  if (!input.title || typeof input.title !== "string" || !input.title.trim()) {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (!input.description || typeof input.description !== "string" || !input.description.trim()) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (!input.date || typeof input.date !== "string" || !input.date.trim()) {
    errors.push("Date is required and must be a non-empty string.");
  }

  if (!input.location || typeof input.location !== "string" || !input.location.trim()) {
    errors.push("Location is required and must be a non-empty string.");
  }

  if (!input.type || typeof input.type !== "string" || !input.type.trim()) {
    errors.push("Type is required and must be a non-empty string.");
  }

  if (input.requiredSkills && (!Array.isArray(input.requiredSkills) || !input.requiredSkills.every(skill => typeof skill === 'string'))) {
    errors.push("requiredSkills must be an array of strings.");
  }

  if (input.status && !["open", "full", "completed"].includes(input.status)) {
    errors.push("Invalid status. Must be 'open', 'full', or 'completed'.");
  }

  return errors;
}
