import { SERCRET_FACEIT_SERVER_KEY } from '$env/static/private';
import type {
	FaceitAPIBanReponse,
	FaceitAPIMatchesResponse,
	FaceitAPIResponse,
	FaceitCs2StatsAPIResponse,
	FaceitCsgoStatsAPIResponse
} from '$lib/types/faceitAPI';

export const getPlayerInfo = async (sid: string, game: string): Promise<FaceitAPIResponse> => {
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

export const getCs2Info = async (
	gameId: string,
	playerId: string
): Promise<FaceitCs2StatsAPIResponse> => {
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

export const getCsgoInfo = async (
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

export const getLastMatch = async (
	playerId: string,
	gameId: string
): Promise<FaceitAPIMatchesResponse> => {
	const response = await fetch(
		`https://open.faceit.com/data/v4/players/${playerId}/history?game=${gameId}&limit=1`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	const data = await response.json();
	return data;
};

export const getPlayerBans = async (playerId: string): Promise<FaceitAPIBanReponse> => {
	const response = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/bans`, {
		headers: {
			Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
		}
	});
	const data = await response.json();
	return data;
};
