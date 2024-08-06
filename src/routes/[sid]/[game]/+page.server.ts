import { SERCRET_FACEIT_SERVER_KEY } from '$env/static/private';

export const load = async ({ request, url, params, parent }) => {
	const game = params.game;
	const playerId = url.searchParams.get('player_id');

	const response = await fetch(
		`https://open.faceit.com/data/v4/players/${playerId}/stats/${game}`,
		{
			headers: {
				Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
			}
		}
	);
	return {
		data: await response.json()
	};
};
