import { describe, it, expect } from 'vitest';
import { validateProfile, isProfileComplete } from './profile';

const now = new Date('2026-06-01');

describe('validateProfile', () => {
	it('accepts a valid name and year and trims the name', () => {
		expect(validateProfile('  Ada  ', '2019', now)).toEqual({
			ok: true,
			value: { name: 'Ada', startYear: 2019 }
		});
	});
	it('rejects an empty name', () => {
		const r = validateProfile('   ', '2019', now);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.errors.name).toBeDefined();
	});
	it('rejects missing / non-string values', () => {
		const r = validateProfile(null, null, now);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(Object.keys(r.errors)).toEqual(['name', 'startYear']);
	});
	it.each(['abc', '19', '20199', '1.5e3', '1949', '2027', ''])('rejects year %j', (y) => {
		const r = validateProfile('Ada', y, now);
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.errors.startYear).toBeDefined();
	});
	it('accepts the boundary years', () => {
		expect(validateProfile('A', '1950', now).ok).toBe(true);
		expect(validateProfile('A', '2026', now).ok).toBe(true);
	});
});

describe('isProfileComplete', () => {
	it('requires name and numeric startYear', () => {
		expect(isProfileComplete({ name: 'Ada', startYear: 2020 })).toBe(true);
		expect(isProfileComplete({ name: 'Ada', startYear: null })).toBe(false);
		expect(isProfileComplete({ name: ' ', startYear: 2020 })).toBe(false);
		expect(isProfileComplete({ name: 'Ada' })).toBe(false);
	});
});
