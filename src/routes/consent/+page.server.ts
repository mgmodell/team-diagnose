import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { isProfileComplete } from '$lib/profile';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) return redirect(302, '/');
	if (locals.user.studyConsent === true) {
		return redirect(302, isProfileComplete(locals.user) ? '/' : '/profile');
	}
	return {};
};

export const actions: Actions = {
	respond: async ({ request, locals }) => {
		if (!locals.user) return redirect(302, '/');

		const choice = (await request.formData()).get('choice');
		if (choice !== 'accept' && choice !== 'decline') {
			return fail(400, { message: 'Please choose whether to participate.' });
		}

		await auth.api.updateUser({
			headers: request.headers,
			body: { name: locals.user.name, studyConsent: choice === 'accept' } as { name: string }
		});
		return redirect(302, choice === 'accept' ? '/profile' : '/');
	}
};
