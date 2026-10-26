import type { User, Session } from 'better-auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// startYear is our custom demographic field (see additionalFields in $lib/server/auth.ts)
		interface Locals { user?: User & { startYear?: number | null }; session?: Session }

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
