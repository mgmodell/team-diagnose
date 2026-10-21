import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { isProfileComplete } from '$lib/profile';

// `load` runs on the server before the page renders; its return value becomes
// the `data` prop of +page.svelte.
export const load: PageServerLoad = ({ locals }) => {
	// Signed in but demographics missing (e.g. brand-new Google account):
	// send them to the profile form.
	if (locals.user && !isProfileComplete(locals.user)) {
		return redirect(302, '/profile');
	}
	return { user: locals.user ?? null };
};

// Form actions handle <form method="POST"> submissions from the page.
export const actions: Actions = {
	// Starts the Google OAuth flow. Better Auth creates the account on first login.
	signInGoogle: async () => {
		const result = await auth.api.signInSocial({
			body: { provider: 'google', callbackURL: '/' }
		});
		if (result.url) return redirect(302, result.url);
		return fail(400, { message: 'Google sign-in failed' });
	},
	signOut: async ({ request }) => {
		await auth.api.signOut({ headers: request.headers });
		return redirect(302, '/');
	}
};
