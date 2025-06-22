import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  date: z.string().min(1, "Date is required."),
  location: z.string().min(1, "Location is required."),
  type: z.string().min(1, "Type is required."),
  requiredSkills: z.array(z.string()).optional(),
  status: z.enum(["open", "full", "completed"]).optional(),
});
