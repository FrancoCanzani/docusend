import { z } from 'zod';

export const viewDataSchema = z.object({
  documentId: z.string(),
  userId: z.string().nullable(),
  email: z.string().email().nullable(),
  timeSpent: z.number().int(),
});
