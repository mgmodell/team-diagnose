import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { validateProfile } from '$lib/profile';

export const load: PageServerLoad = ({ locals }) => {
	// Only signed-in users may see this page.
	if (!locals.user) return redirect(302, '/');
	if (locals.user.studyConsent !== true) return redirect(302, '/consent');
	if (locals.user.startYear != null) return redirect(302, '/');
	return { user: locals.user };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) return redirect(302, '/');
		if (locals.user.studyConsent !== true) return redirect(302, '/consent');

		const formData = await request.formData();
		const name = formData.get('name');
		const startYear = formData.get('startYear');
		const result = validateProfile(name, startYear);

		if (!result.ok) {
			// fail() returns the errors (and the typed values) to the page as `form`.
			return fail(400, {
				errors: result.errors,
				name: String(name ?? ''),
				startYear: String(startYear ?? '')
			});
		}

		// Stores the values in the `user` table. The cast is needed because Better Auth's
		// updateUser typings don't include our custom `startYear` field.
		await auth.api.updateUser({
			headers: request.headers,
			body: { name: result.value.name, startYear: result.value.startYear } as { name: string }
		});
		return redirect(302, '/');
	}
};
