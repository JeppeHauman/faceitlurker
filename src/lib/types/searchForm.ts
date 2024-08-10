import { z } from 'zod';

export const searchSchema = z.object({
	steamUrl: z.string()
});

export type SearchSchema = typeof searchSchema;
