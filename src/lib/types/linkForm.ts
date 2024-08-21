import { z } from 'zod';

export const linkSchema = z.object({
	player_id: z.string()
});

export type LinkSchema = typeof linkSchema;
