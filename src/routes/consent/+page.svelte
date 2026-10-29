<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<h1>Study participation</h1>
<p>Study participation information will be added here.</p>
<p>Would you like to participate in this study?</p>

<form method="post" action="?/respond" use:enhance>
	<button type="submit" name="choice" value="accept">I consent to participate</button>
	<button type="submit" name="choice" value="decline">I do not consent</button>
</form>
{#if form?.message}<p role="alert">{form.message}</p>{/if}
