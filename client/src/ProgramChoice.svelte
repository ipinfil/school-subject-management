<script>
    import { user } from "./stores";
	import { programs } from "./stores";
    import { onMount } from 'svelte';

    let programChoices = [];

    onMount(() => {
        fetch('http://localhost:5678/api/programs/list', {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            $programs = data.programs;

            for (let program of data.programs) {
                let programName = program.skratka + ' - ' + program.popis;
                programChoices.push({key: program.skratka, name: programName});
            }

            programChoices = programChoices;
        })
    });

    function handleProgramChoice(e) {
        fetch('http://localhost:5678/api/users/program-choice', {
			method: "post",
			credentials: "include",
			headers: {
				'Content-Type': 'application/json'
			},
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
                    <input type="number" bind:value="{$user.year}" name="year" class="form-control">
                </div>
                <div class="pe-3">
                    <label for="year">Študijný program</label>
                    <select bind:value="{$user.program}" class="form-select" aria-label="Default select example" name="program">
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