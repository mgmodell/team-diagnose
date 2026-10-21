<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<h1>Tell us about yourself</h1>

<form method="post" action="?/save" use:enhance>
	<label>
		Name
		<!-- On a failed submit show what the user typed, otherwise their Google name. -->
		<input name="name" required value={form?.name ?? data.user.name} />
	</label>
	{#if form?.errors?.name}<p role="alert">{form.errors.name}</p>{/if}

	<label>
		Year you started college
		<input
			name="startYear"
			inputmode="numeric"
			required
			value={form?.startYear ?? data.user.startYear ?? ''}
		/>
	</label>
	{#if form?.errors?.startYear}<p role="alert">{form.errors.startYear}</p>{/if}

	<button type="submit">Save</button>
</form>
