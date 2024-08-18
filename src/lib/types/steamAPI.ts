import { z } from 'zod';

export const steamBansAPIResponse = z.object({
	players: z.array(
		z.object({
			SteamId: z.string(),
			CommunityBanned: z.boolean(),
			VACBanned: z.boolean(),
			NumberOfVACBans: z.number(),
			DaysSinceLastBan: z.number(),
			NumberOfGameBans: z.number(),
			EconomyBan: z.string()
		})
	)
});

export type SteamBansAPIResponse = z.infer<typeof steamBansAPIResponse>;

export const steamGameHoursAPIRResponseSchema = z.object({
	response: z.object({
		game_count: z.number(),
		games: z.array(
			z.object({
				appid: z.number(),
				playtime_forever: z.number(),
				playtime_2weeks: z.number().optional()
			})
		)
	})
});

export type SteamGameHoursAPIResponse = z.infer<typeof steamGameHoursAPIRResponseSchema>;
