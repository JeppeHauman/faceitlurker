import { z } from 'zod';

const faceitGameSchema = z.object({
	region: z.string(),
	game_player_id: z.string(),
	skill_level: z.number(),
	faceit_elo: z.number()
});

export type FaceitGame = z.infer<typeof faceitGameSchema>;

export const faceitAPIResponseSchema = z.object({
	player_id: z.string(),
	nickname: z.string(),
	avatar: z.string(),
	country: z.string(),
	games: z.object({
		cs2: faceitGameSchema.optional(),
		csgo: faceitGameSchema.optional()
	}),
	steam_id_64: z.string()
});

export const FaceitAPIResponseErrorSchema = z.object({
	message: z.string(),
	code: z.string(),
	http_status: z.number(),
	parameters: z.array(z.any())
});

const faceitAPIErrorsSchema = z.object({
	errors: z.array(FaceitAPIResponseErrorSchema)
});

export type FaceitAPIErrors = z.infer<typeof faceitAPIErrorsSchema>;

export type FaceitAPIResponse = z.infer<typeof faceitAPIResponseSchema> & FaceitAPIErrors;

// STATS API

export const faceitStatsAPIResponse = z.object({});

// BANS API

export const faceitAPIBanSchema = z.object({
	nickname: z.string(),
	type: z.string(),
	reason: z.string(),
	starts_at: z.string(),
	ends_at: z.string().optional(),
	user_id: z.string()
});

export const faceitAPIBanResponseSchema = z.object({
	items: z.array(faceitAPIBanSchema),
	start: z.number(),
	end: z.number()
});

export type FaceitAPIBanReponse = z.infer<typeof faceitAPIBanResponseSchema>;
