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
	steam_id_64: z.string(),
	faceit_url: z.string(),
	settings: z.object({
		language: z.string()
	})
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

export const csgoLifetimeStats = z.object({
	Matches: z.string(),
	Wins: z.string(),
	'Average Headshots %': z.string(),
	'Win Rate %': z.string(),
	'Average K/D Ratio': z.string()
});

export const cs2LifetimeStats = z.object({
	Matches: z.string(),
	Wins: z.string(),
	'Total Matches': z.string(),
	'Average Headshots %': z.string(),
	'Average K/D Ratio': z.string()
});

export const segmentSchema = z.object({
	img_small: z.string(),
	img_regular: z.string(),
	label: z.string(),
	mode: z.string(),
	type: z.string(),
	stats: z.object({
		Matches: z.string(),
		Wins: z.string(),
		'Win Rate %': z.string().optional(),
		Deaths: z.string(),
		Kills: z.string(),
		'Average K/D Ratio': z.string()
	})
});

export const faceitCsgoStatsAPIResponse = z.object({
	game_id: z.string(),
	player_id: z.string(),
	lifetime: csgoLifetimeStats,
	segments: z.array(segmentSchema)
});

export type FaceitCsgoStatsAPIResponse = z.infer<typeof faceitCsgoStatsAPIResponse> &
	FaceitAPIErrors;

export const faceitCs2StatsAPIResponse = z.object({
	game_id: z.string(),
	player_id: z.string(),
	lifetime: cs2LifetimeStats,
	segments: z.array(segmentSchema)
});

export type FaceitCs2StatsAPIResponse = z.infer<typeof faceitCs2StatsAPIResponse> & FaceitAPIErrors;

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

export const faceitAPITopPlayersResponseSchema = z.object({
	start: z.number(),
	end: z.number(),
	items: z.array(
		z.object({
			country: z.string(),
			faceit_elo: z.number(),
			game_skill_level: z.number(),
			nickname: z.string(),
			player_id: z.string(),
			position: z.number()
		})
	)
});

export type FaceitAPITopPlayersResponse = z.infer<typeof faceitAPITopPlayersResponseSchema>;
