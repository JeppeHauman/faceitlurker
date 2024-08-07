import type { PageServerLoad } from './$types';
import { SERCRET_FACEIT_SERVER_KEY } from '$env/static/private';
import { z } from 'zod';
import type { FaceitAPIResponse, FaceitAPIErrors, FaceitAPIBanReponse } from '$lib/types/faceitAPI';
import { faceitAPIResponseSchema } from '$lib/types/faceitAPI';
import { redirect, fail, error } from '@sveltejs/kit';

const getPlayerInfo = async (sid: string): Promise<FaceitAPIResponse> => {
	const response = await fetch(
		`https://open.faceit.com/data/v4/players?game_player_id=${sid}&game=csgo`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	const data = await response.json();
	return data;
};

const getGameInfo = async (gameId: string, playerId: string) => {
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

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60'
	});
	const data = await getPlayerInfo(params.sid);
	if (data.errors) {
		error(404, 'No faceit account found');
	}

	if (data.games) {
		return {
			player: data,
			streamed: {
				bans: getPlayerBans(data.player_id),
				cs2: getGameInfo('cs2', data.player_id),
				csgo: getGameInfo('csgo', data.player_id)
			}
		};
	}

	return {
		player: data,
		streamed: {
			bans: getPlayerBans(data.player_id),
			mainGame: getGameInfo('csgo', data.player_id)
		}
	};
};
