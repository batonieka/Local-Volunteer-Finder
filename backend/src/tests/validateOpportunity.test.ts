import { opportunitySchema } from "../validation/opportunitySchema";

describe("Zod Opportunity Schema Validation", () => {
  it("✅ should pass for valid input", () => {
    const validInput = {
      title: "Park Cleanup",
      description: "Clean the park",
      date: "2025-06-10",
      location: "Central Park",
      type: "Environmental",
      requiredSkills: ["Teamwork", "Physical stamina"],
      status: "open"
    };

    const result = opportunitySchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("❌ should fail if required fields are missing", () => {
    const invalidInput = {
      description: "Missing title",
      date: "2025-06-10",
      location: "Central Park",
      type: "Environmental"
    };

    const result = opportunitySchema.safeParse(invalidInput);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errorFields = result.error.issues.map(issue => issue.path[0]);
      expect(errorFields).toContain("title");
    }
  });

  it("❌ should fail if `requiredSkills` has non-string values", () => {
    const input = {
      title: "Beach Cleanup",
      description: "Cleaning beach",
      date: "2025-06-11",
      location: "Seaside",
      type: "Environmental",
      requiredSkills: ["Teamwork", 42] // <- Invalid
    };

    const result = opportunitySchema.safeParse(input);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path).toContain("requiredSkills");
    }
  });

  it("❌ should fail if `status` is not in the allowed enum", () => {
    const input = {
      title: "Tree Planting",
      description: "Planting trees",
      date: "2025-07-01",
      location: "City Park",
      type: "Environmental",
      status: "pending" as any // invalid
    };

    const result = opportunitySchema.safeParse(input);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe("status");
    }
  });

  it("✅ should accept optional fields when omitted", () => {
    const input = {
      title: "Event Photography",
      description: "Take photos at community events",
      date: "2025-07-10",
      location: "Town Hall",
      type: "Creative"
    };

    const result = opportunitySchema.safeParse(input);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.requiredSkills).toBeUndefined();
      expect(result.data.status).toBeUndefined();
    }
  });
});
