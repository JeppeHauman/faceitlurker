import type { PageServerLoad } from './$types';
import { SERCRET_FACEIT_SERVER_KEY, SECRET_STEAM_API_KEY } from '$env/static/private';
import { z } from 'zod';
import type {
	FaceitAPIResponse,
	FaceitAPIErrors,
	FaceitAPIBanReponse,
	FaceitCs2StatsAPIResponse,
	FaceitCsgoStatsAPIResponse
} from '$lib/types/faceitAPI';
import { faceitAPIResponseSchema } from '$lib/types/faceitAPI';
import { redirect, fail, error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { searchSchema } from '$lib/types/searchForm';
import type { SteamBansAPIResponse } from '$lib/types/steamAPI';

const getPlayerInfo = async (sid: string, game: string): Promise<FaceitAPIResponse> => {
	const response = await fetch(
		`https://open.faceit.com/data/v4/players?game_player_id=${sid}&game=${game}`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	const data = await response.json();
	return data;
};

const getCs2Info = async (gameId: string, playerId: string): Promise<FaceitCs2StatsAPIResponse> => {
	const response = await fetch(
		`https://open.faceit.com/data/v4/players/${playerId}/stats/${gameId}`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	const data = await response.json();
	return data;
};

const getCsgoInfo = async (
	gameId: string,
	playerId: string
): Promise<FaceitCsgoStatsAPIResponse> => {
	const response = await fetch(
		`https://open.faceit.com/data/v4/players/${playerId}/stats/${gameId}`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	const data = await response.json();
	return data;
};

const getPlayerBans = async (playerId: string): Promise<FaceitAPIBanReponse> => {
	const response = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/bans`, {
		headers: {
			Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
		}
	});
	const data = await response.json();
	return data;
};

const getSteamBans = async (steamId: string): Promise<SteamBansAPIResponse> => {
	const response = await fetch(
		`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${SECRET_STEAM_API_KEY}&steamids=${steamId}`
	);
	const data = await response.json();
	return data;
};

// USEFUL FOR GETTING HOURS IN GAME
const getSteamStats = async (sid: string) => {
	const response = await fetch(
		`https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${SECRET_STEAM_API_KEY}&format=json&steamid=${sid}`
	);
	const data = await response.json();

	return data;
};

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	// MAYBE USE THIS FOR HOURS IN GAME
	// getSteamStats(params.sid);
	// const games = await getSteamStats(params.sid);
	// const csHours = games.response.games.filter((obj) => {
	// 	return obj.appid === 730;
	// });

	// try cs2 first
	let data = await getPlayerInfo(params.sid, 'cs2');
	if (data.errors) {
		data = await getPlayerInfo(params.sid, 'csgo');
	}
	if (data.errors) {
		error(404, 'No faceit account found');
	}

	const searchForm = await superValidate(zod(searchSchema));

	if (data.games) {
		return {
			player: data,
			searchForm,
			streamed: {
				bans: getPlayerBans(data.player_id),
				cs2: getCs2Info('cs2', data.player_id),
				csgo: getCsgoInfo('csgo', data.player_id),
				steamBans: getSteamBans(data.steam_id_64),
				hours: getSteamStats(data.steam_id_64)
			}
		};
	}

	return {
		player: data,
		searchForm,
		streamed: {
			bans: getPlayerBans(data.player_id),
			steamBans: getSteamBans(data.steam_id_64)
		}
	};
};
