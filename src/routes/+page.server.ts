import type { PageServerLoad, Actions } from './$types';
import { SERCRET_FACEIT_SERVER_KEY, SECRET_STEAM_API_KEY } from '$env/static/private';
import SteamID from 'steamid';
import { redirect } from '@sveltejs/kit';
import { superValidate, fail, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { searchSchema } from '$lib/types/searchForm';

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

	const searchForm = await superValidate(zod(searchSchema));

	return { searchForm };
};

export const actions = {
	search: async ({ request }) => {
		const form = await superValidate(request, zod(searchSchema));
		// const formData = Object.fromEntries(await request.formData());
		if (!form.valid) {
			return fail(400, { form });
		}

		if (!steamRegex.test(form.data.steamUrl)) {
			return setError(form, '', 'Please use steam profile url');
		}
		const newUrl = new URL(form.data.steamUrl);
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
