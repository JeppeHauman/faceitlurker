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
