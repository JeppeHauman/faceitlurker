import type { PageServerLoad, Actions } from './$types';
import { SERCRET_FACEIT_SERVER_KEY, SECRET_STEAM_API_KEY } from '$env/static/private';
import SteamID from 'steamid';
import { fail, redirect } from '@sveltejs/kit';

const steamRegex = /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+/;

export const load: PageServerLoad = async ({ url }) => {
	// const response = await fetch(`https://open.faceit.com/data/v4/games`, {
	// 	headers: {
	// 		Authorization: `Bearer ${SERCRET_FACEIT_SERVER_KEY}`
	// 	}
	// });
	// return {
	// 	data: await response.json()
	// };
};

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		if (!steamRegex.test(formData.profileUrl.toString())) {
			console.log(false);
			return fail(400, {
				error: true,
				message: 'Please use steam profile url'
			});
		}
		const newUrl = new URL(formData.profileUrl.toString());
		const filteredPath = newUrl.pathname.split('/').filter((el) => {
			return el !== '';
		});
		let sid;
		if (filteredPath[0] === 'profiles') {
			try {
				sid = new SteamID(filteredPath[1]);
			} catch (error) {
				console.log(error);
			}
		}

		if (!sid) {
			try {
				const response = await fetch(
					`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${SECRET_STEAM_API_KEY}&vanityurl=${filteredPath[1]}`
				);
				const data = await response.json();
				if (data.response.success === 1) {
					sid = new SteamID(data.response.steamid);
				}
			} catch (error) {
				console.log(error);
			}
		}
		if (sid && sid.isValidIndividual()) {
			redirect(303, `/${sid.getSteamID64().toString()}`);
		}
		if (!sid || !sid.isValidIndividual()) {
			return {
				message: 'No steam account found'
			};
		}
	}
} satisfies Actions;
