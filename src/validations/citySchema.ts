import { z } from 'zod';

export const citySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  state: z.string().min(1, "State is required"),
  status: z.enum(["active", "inactive"]),
});

export type CityFormSchema = z.infer<typeof citySchema>;