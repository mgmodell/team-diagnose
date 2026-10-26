<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	// $props() is the Svelte 5 way to receive props. `data` comes from +page.server.ts `load`,
	// `form` holds the result of the last form action (e.g. an error message).
	let { data, form }: PageProps = $props();
</script>

<h1>Diagnosing Teams</h1>

{#if data.user}
	<p>Welcome, {data.user.name}! You started college in {data.user.startYear}.</p>
	<form method="post" action="?/signOut" use:enhance>
		<button type="submit">Sign out</button>
	</form>
{:else}
	<p>Please log in to continue.</p>
	<form method="post" action="?/signInGoogle">
		<button type="submit">Sign in with Google</button>
	</form>
	{#if form?.message}<p role="alert">{form.message}</p>{/if}
{/if}
