import { validateOpportunityInput } from '../utils/validateOpportunity';
import { VolunteerOpportunity } from '../types';

describe('validateOpportunityInput', () => {
  it('should return no errors for valid input', () => {
    const validInput: Partial<VolunteerOpportunity> = {
      title: "Test",
      description: "Some description",
      date: "2025-07-01",
      location: "Tbilisi",
      type: "Education",
      requiredSkills: ["Communication"],
      status: "open" // type-safe literal
    };

    const errors = validateOpportunityInput(validInput);
    expect(errors.length).toBe(0);
  });

  it('should return errors for missing required fields', () => {
    const input: Partial<VolunteerOpportunity> = {
      title: "",
      description: "",
      date: "",
      location: "",
      type: ""
    };

    const errors = validateOpportunityInput(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Title"),
        expect.stringContaining("Description"),
        expect.stringContaining("Date"),
        expect.stringContaining("Location"),
        expect.stringContaining("Type")
      ])
    );
  });

  it('should return an error for invalid status', () => {
    const input: Partial<VolunteerOpportunity> = {
      title: "Test",
      description: "Desc",
      date: "2025-07-01",
      location: "Tbilisi",
      type: "Community",
      status: "invalid-status" as any // intentionally wrong
    };

    const errors = validateOpportunityInput(input);
    expect(errors).toContain("Invalid status. Must be 'open', 'full', or 'completed'.");
  });

  it('should return an error if requiredSkills is not an array of strings', () => {
    const input: Partial<VolunteerOpportunity> = {
      title: "Test",
      description: "Desc",
      date: "2025-07-01",
      location: "Tbilisi",
      type: "Community",
      requiredSkills: ["Teamwork", 123] as any // mixed array
    };

    const errors = validateOpportunityInput(input);
    expect(errors).toContain("requiredSkills must be an array of strings.");
  });
});
