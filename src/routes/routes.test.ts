import { describe, it, expect, vi, beforeEach } from 'vitest';

// Replace the real Better Auth instance (needs a DB) with spies.
const auth = vi.hoisted(() => ({
	api: { signInSocial: vi.fn(), signOut: vi.fn(), updateUser: vi.fn() }
}));
vi.mock('$lib/server/auth', () => ({ auth }));

import * as landing from './+page.server';
import * as profile from './profile/+page.server';

// Helper: SvelteKit's redirect() throws; capture it so we can inspect it.
async function redirectOf(fn: () => unknown) {
	try {
		await fn();
	} catch (e) {
		return e as { status: number; location: string };
	}
	return undefined;
}

// Loosely-typed event builders keep the tests short.
const call = (fn: unknown, event: object) => (fn as (e: object) => unknown)(event);
const formReq = (fields: Record<string, string>) =>
	new Request('http://x/', { method: 'POST', body: new URLSearchParams(fields) });

beforeEach(() => vi.clearAllMocks());

describe('landing page', () => {
	it('shows the login page to anonymous visitors', async () => {
		expect(await call(landing.load, { locals: {} })).toEqual({ user: null });
	});
	it('redirects signed-in users with no start year to /profile', async () => {
		const r = await redirectOf(() =>
			call(landing.load, { locals: { user: { name: 'Ada', startYear: null } } })
		);
		expect(r).toMatchObject({ status: 302, location: '/profile' });
	});
	it('returns the user when the profile is complete', async () => {
		const user = { name: 'Ada', startYear: 2020 };
		expect(await call(landing.load, { locals: { user } })).toEqual({ user });
	});
	it('signInGoogle redirects to the Google URL', async () => {
		auth.api.signInSocial.mockResolvedValue({ url: 'https://accounts.google.com/x' });
		const r = await redirectOf(() => call(landing.actions.signInGoogle, {}));
		expect(r).toMatchObject({ status: 302, location: 'https://accounts.google.com/x' });
		expect(auth.api.signInSocial).toHaveBeenCalledWith({
			body: { provider: 'google', callbackURL: '/' }
		});
	});
	it('signInGoogle fails when no URL is returned', async () => {
		auth.api.signInSocial.mockResolvedValue({});
		expect(await call(landing.actions.signInGoogle, {})).toMatchObject({ status: 400 });
	});
	it('signOut calls Better Auth and redirects home', async () => {
		const r = await redirectOf(() => call(landing.actions.signOut, { request: formReq({}) }));
		expect(auth.api.signOut).toHaveBeenCalled();
		expect(r).toMatchObject({ status: 302, location: '/' });
	});
});

describe('profile page', () => {
	it('load redirects anonymous users home', async () => {
		const r = await redirectOf(() => call(profile.load, { locals: {} }));
		expect(r).toMatchObject({ status: 302, location: '/' });
	});
	it('load returns the user', async () => {
		const user = { name: 'Ada' };
		expect(await call(profile.load, { locals: { user } })).toEqual({ user });
	});
	it('save rejects anonymous users', async () => {
		const r = await redirectOf(() =>
			call(profile.actions.save, { locals: {}, request: formReq({}) })
		);
		expect(r).toMatchObject({ status: 302, location: '/' });
		expect(auth.api.updateUser).not.toHaveBeenCalled();
	});
	it('save returns validation errors without touching the database', async () => {
		const res = await call(profile.actions.save, {
			locals: { user: { name: 'A' } },
			request: formReq({ name: '', startYear: 'nope' })
		});
		expect(res).toMatchObject({ status: 400 });
		expect((res as { data: { errors: object } }).data.errors).toHaveProperty('name');
		expect(auth.api.updateUser).not.toHaveBeenCalled();
	});
	it('save stores valid demographics and redirects home', async () => {
		const request = formReq({ name: ' Ada ', startYear: '2020' });
		const r = await redirectOf(() =>
			call(profile.actions.save, { locals: { user: { name: 'A' } }, request })
		);
		expect(auth.api.updateUser).toHaveBeenCalledWith({
			headers: request.headers,
			body: { name: 'Ada', startYear: 2020 }
		});
		expect(r).toMatchObject({ status: 302, location: '/' });
	});
});
