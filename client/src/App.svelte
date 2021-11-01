<script>
	import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

	import { user } from "./stores";
	import Login from "./Login.svelte";
	import Main from "./Main.svelte";

	let loaded = false;
	let registered = false;

	onMount(() => {
		fetch('http://localhost:5678/api/users/status', {
			method: 'get',
			credentials: 'include'
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			$user.loggedIn = data.status;

			if (data.user) {
				$user.username = data.user.name;
				$user.program = data.user.program;
				$user.year = data.user.year;
				$user.initialized = data.user.program && data.user.year;
			}

			loaded = true;
		});
	});
</script>

<main class:container="{!$user.loggedIn}" class:container-fluid="{$user.loggedIn}" class:loading="{!loaded}">
	{#if loaded}
		{#if !$user.loggedIn}
			<div class="wrapper" transition:fade="{{delay: 100, duration: 300}}">
				<Login bind:registered={registered} />
			</div>
		{:else}
			<Main {registered} />
		{/if}
	{/if}
</main>

<style>
	.loading {
		opacity: 0.3;
	}

	.container-fluid {
		padding-left: 0;
		padding-right: 0;
	}
</style>