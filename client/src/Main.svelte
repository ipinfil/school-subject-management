<script>
  import { fade } from "svelte/transition";
  import { user } from "./stores";
  import ProgramChoice from "./ProgramChoice.svelte";
  import Subjects from "./Subjects.svelte";
  import { baseUrl, defaultRequestOptions } from './constants';

  export let registered;

  let initializing = false;
  let initialize_message = 'Inicializujem databázu...';
  let initialize_status = '';

  function initialize(e) {
    let main = document.querySelector(".main");
    console.log(main);
    initializing = true;

    fetch(baseUrl + "init", {
      ...defaultRequestOptions,
      method: "post",
    })
      .then((res) => res.json())
      .then((data) => {
        main.style.opacity = 0;
        initialize_status = 'success';

        if (!data.status) {
          initialize_status = 'error';
          initialize_message = data.msg;
        }

        initialize_message = 'Databáza úspešne inicializovaná.';
        setTimeout(() => {
          location.reload();
        }, 3000);
      });
  }

  function handleLogout(e) {
    fetch(baseUrl + "users/logout", {
      ...defaultRequestOptions,
      method: "post",
    })
      .then((res) => res.json())
      .then((data) => {
        $user = { loggedIn: false };
      });
  }
</script>

<div
  id="main-wrapper"
  class="wrapper"
  transition:fade={{ delay: 0, duration: 300 }}
>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#/">Výber predmetov</a>
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
      <div
        class="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <form class="d-flex" on:submit|preventDefault={handleLogout}>
          <span class="navbar-text me-2"
            >Prihlásený je <strong>{$user.username}</strong>. {#if registered}Práve
              ste sa zaregistrovali.{/if}</span
          >
          <button type="button" class="btn btn-info me-2" on:click={initialize}
            >Inicializácia databázy</button
          >
          <button class="btn btn-danger" type="submit">Odhlásiť sa</button>
        </form>
      </div>
    </div>
  </nav>
  {#if !initializing }
  <section class="main" transition:fade={{ delay: -300, duration: 300 }}>
    {#if !$user.initialized}
      <ProgramChoice />
    {:else}
      <Subjects />
    {/if}
  </section>
  {:else}
    <section id="loading" transition:fade={{ delay: 300, duration: 300 }}>
      <h1 class="text-center text-{initialize_status}" style="margin-top: 300px;">{ initialize_message }</h1>
    </section>
  {/if}

</div>

<style>
  .wrapper {
    min-height: 100vh;
  }
</style>
