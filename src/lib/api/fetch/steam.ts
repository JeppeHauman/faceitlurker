import { SECRET_STEAM_API_KEY } from '$env/static/private';
import type { SteamBansAPIResponse, SteamGameHoursAPIResponse } from '$lib/types/steamAPI';

export const getSteamBans = async (steamId: string): Promise<SteamBansAPIResponse> => {
	const response = await fetch(
		`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${SECRET_STEAM_API_KEY}&steamids=${steamId}`
	);
	const data = await response.json();
	return data;
};

// USEFUL FOR GETTING HOURS IN GAME
export const getSteamGames = async (sid: string): Promise<SteamGameHoursAPIResponse> => {
	const response = await fetch(
		`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${SECRET_STEAM_API_KEY}&format=json&steamid=${sid}`
	);
	const data = await response.json();

	return data;
};
