import { z } from 'zod';

export const viewDataSchema = z.object({
  documentId: z.string(),
  userId: z.string().optional(),
  email: z.string().email().optional(),
  timeSpent: z.number().int(),
});
