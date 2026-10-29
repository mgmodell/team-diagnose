import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isProfileComplete } from '$lib/profile';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) return redirect(302, '/');
	if (locals.user.studyConsent !== true) return redirect(302, '/consent');
	if (!isProfileComplete(locals.user)) return redirect(302, '/profile');
	return {};
};
