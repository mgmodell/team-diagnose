// Pure (framework-free) helpers for the demographic profile form.
// Keeping them separate from the route files makes them easy to unit test.

/** Earliest college start year we accept. */
export const MIN_START_YEAR = 1950;

export type ProfileInput = { name: string; startYear: number };
export type ProfileResult =
	{ ok: true; value: ProfileInput } | { ok: false; errors: { name?: string; startYear?: string } };

/**
 * Validate the raw (string) values submitted by the profile form.
 * `now` is injectable so tests don't depend on the current date.
 */
export function validateProfile(
	rawName: unknown,
	rawYear: unknown,
	now: Date = new Date()
): ProfileResult {
	const errors: { name?: string; startYear?: string } = {};
	const name = typeof rawName === 'string' ? rawName.trim() : '';
	if (!name) errors.name = 'Please enter your name.';

	const yearText = typeof rawYear === 'string' ? rawYear.trim() : '';
	const startYear = Number(yearText);
	const maxYear = now.getFullYear();
	if (!/^\d{4}$/.test(yearText) || startYear < MIN_START_YEAR || startYear > maxYear) {
		errors.startYear = `Please enter a four-digit year between ${MIN_START_YEAR} and ${maxYear}.`;
	}

	if (errors.name || errors.startYear) return { ok: false, errors };
	return { ok: true, value: { name, startYear } };
}

/** A profile is complete once the user has a name and a start year. */
export function isProfileComplete(user: { name?: string | null; startYear?: number | null }) {
	return Boolean(user.name?.trim()) && typeof user.startYear === 'number';
}
