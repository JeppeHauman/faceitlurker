import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { searchSchema } from '$lib/types/searchForm';
import {
	getCs2Info,
	getCsgoInfo,
	getLastMatch,
	getPlayerBans,
	getPlayerInfo
} from '$lib/api/fetch/faceit';
import { getSteamBans, getSteamGames } from '$lib/api/fetch/steam';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	// try cs2 first
	let data = await getPlayerInfo(params.sid, 'cs2');
	if (data.games && !data.games.cs2 && !data.games.csgo) {
		error(404, 'No games on faceit');
	}

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
				hours: getSteamGames(data.steam_id_64),
				lastCs2Match: getLastMatch(data.player_id, 'cs2'),
				lastCsgoMatch: getLastMatch(data.player_id, 'csgo')
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
