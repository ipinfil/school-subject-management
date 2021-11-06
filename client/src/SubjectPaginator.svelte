<script>
    import Subject from './Subject.svelte';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    export let subjects;
    export let fields;
    export let actions;
    export let detailSubject;
    export let modal;

    let step = 10;
    let maxRecords = step;
</script>

    <tbody>
        {#each subjects as subject, i}
            {#if i < maxRecords}
                <tr transition:fade="{{ duration: 200, intro: true}}">
                    <td>{i + 1}</td>
                    <Subject {fields} {subject} {actions}
                        bind:detailSubject={detailSubject} {modal}
                        on:refresh="{(e) => {dispatch('refresh');}}"
                    />
                </tr>
            {/if}
        {:else}
                <tr>
                    <td colspan="100%" class="text-muted text-center"><small>Nenašli sa žiadne predmety.</small></td>
                </tr>
        {/each}
    </tbody>
    {#if subjects.length > maxRecords}
    <tfoot>
        <tr>
            <td colspan="7"><button class="btn btn-primary" on:click="{() => maxRecords += step}">Zobraziť viac</button></td>
        </tr>
    </tfoot>
    {/if}
<style>

</style>