<script>
    import { user } from "./stores";
    import { onMount } from 'svelte';
    import { baseUrl, defaultRequestOptions } from './constants';

    let programChoices = [];

    onMount(() => {
        fetch(baseUrl + 'programs/list', defaultRequestOptions).then(res => res.json())
        .then(data => {
            for (let program of data.programs) {
                let programName = program.skratka + ' - ' + program.popis;
                programChoices.push({key: program.skratka, name: programName});
            }

            programChoices = programChoices;
        })
    });

    function handleProgramChoice(e) {
        fetch(baseUrl + 'users/program-choice', {
            ...defaultRequestOptions,
			method: "post",
            body: JSON.stringify({
                program: $user.program,
                year: $user.year
            })
		})
		.then(res => res.json())
		.then(data => {
			if (data.status) {
                $user.initialized = true;
            } else {
                // TODO:
            }
		});
    }
</script>

<div id="year-form" class="container">
    <div class="row">
        <div class="col">
            <h2 class="mb-4 text-center">Vyberte si rok štúdia a študijný program.</h2>
            <form class="d-flex justify-content-center" on:submit|preventDefault="{handleProgramChoice}">
                <div class="pe-1">
                    <label for="year">Rok štúdia</label>
                    <input id="year" type="number" bind:value="{$user.year}" name="year" class="form-control">
                </div>
                <div class="pe-3">
                    <label for="program">Študijný program</label>
                    <select id="program" bind:value="{$user.program}" class="form-select" aria-label="Default select example" name="program">
                        {#each programChoices as option}
                            <option value="{option.key}">{option.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <div class="row align-items-end h-100">
                        <button class="btn btn-success" type="submit">Pokračovať</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    #year-form {
        padding-top: 20%;
    }
</style>