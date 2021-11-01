<script>
    import { fade } from 'svelte/transition';
	import { user } from "./stores";
    import ProgramChoice from "./ProgramChoice.svelte";
    import Subjects from "./Subjects.svelte";

    export let registered;

    function initialize(e) {
        let wrapper = document.getElementById('main-wrapper');
        let mainSection = document.querySelector('section.main');
        wrapper.style.backgroundColor = 'grey';
        mainSection.style.opacity = 0.3;

        fetch('http://localhost:5678/api/init', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            console.log('initialized');
        })

        wrapper.style.backgroundColor = 'white';
        mainSection.style.opacity = 1;
    }

    function handleLogout(e) {
		fetch('http://localhost:5678/api/users/logout', {
			method: "post",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then(res => res.json())
		.then(data => {
			$user.username = data.user;
			$user.loggedIn = !data.status;
		});
	}

</script>

<div id="main-wrapper" class="wrapper" transition:fade="{{delay: 100, duration: 300}}">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Výber predmetov</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon" />
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
            <form class="d-flex" on:submit|preventDefault="{handleLogout}">
                <span class="navbar-text me-2">Prihlásený je <strong>{$user.username}</strong>. {#if registered}Práve ste sa zaregistrovali.{/if}</span>
                <button type="button" class="btn btn-info me-2" on:click="{initialize}">Inicializácia databázy</button>
              <button class="btn btn-danger" type="submit">Odhlásiť sa</button>
            </form>
          </div>
        </div>
      </nav>
      <section class="main">
        {#if !$user.initialized}
            <ProgramChoice />
        {:else}
            <Subjects />
        {/if}
    </section>
</div>


<style>
    .wrapper {
        min-height: 100vh;
    }
</style>
