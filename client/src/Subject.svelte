<script>
    import { user } from "./stores";
    import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

    export let fields;
    export let subject;
    export let actions;
    export let modal;
    export let detailSubject;

    let subjectValueMapping = {
        nazov: (subject) => subject.nazov ?? "-",
        semester: (subject) => subject.semester ?? "-",
        vyucujuci: (subject) => subject.vyucujuci !== undefined ? subject.vyucujuci.substring(0,21) + (subject.vyucujuci.length > 21 ? '...' : '') : "-",
        typ: (subject) => subject.typ === "p" ? "P" : (subject.typ === "pv" ? "PV" : "V"),
        kreditneOhodnotenie: (subject) => subject.kreditneOhodnotenie,
        prerekvizity: (subject) => {
            let maxLevel = null;

            for (let control of subject.prerequisites_control) {
                if (maxLevel === null || maxLevel.level < control.level) {
                    maxLevel = control;
                }
            }

            return maxLevel.value + (maxLevel.level !== 0 ? ' <i class="fas fa-question-circle text-muted" title="' + (maxLevel.reason ?? '') + '"></i>' : '');
        },
        skratka: (subject) => subject.skratka
    };

    const updateStudentPickedSubjects = (callback = null) => {
        // fetch all program subjects
        fetch('http://localhost:5678/api/students/update-subjects', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subjects: $user.pickedSubjects
            })
        }).then(res => res.json())
        .then(data => {
            if (!data.status) {
                console.error("Unable to update student's picked subjects!");
            }

            if (callback) {
                callback();
            }
        });
    };

    const updateStudentTakenSubjects = (callback = null) => {
        // fetch all program subjects
        fetch('http://localhost:5678/api/students/update-taken-subjects', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subjects: $user.takenSubjects
            })
        }).then(res => res.json())
        .then(data => {
            if (!data.status) {
                console.error("Unable to update student's taken subjects!");
            }
            if (callback) {
                callback();
            }
        });
    };


</script>

{#each fields as field}
    <td class="fs-6">{@html subjectValueMapping[field](subject)}</td>
{/each}
{#each actions as action}
    {#if action == 'info'}
        <td><i on:click="{(e) => {detailSubject = subject; modal.show();}}" title="Informácie o predmete" class="text-primary fas fa-info-circle"></i></td>
    {:else if action === 'add/remove'}
        {#if $user.pickedSubjectCodes && $user.pickedSubjectCodes.includes(subject.skratka)}
            <td><i on:click="{(e) => {
                $user.pickedSubjects = $user.pickedSubjects.filter((sbj) => sbj.skratka !== subject.skratka);
                updateStudentPickedSubjects(() => {
                    dispatch('refresh');
                })
                }}" title="Odstrániť predmet" class="text-danger fas fa-minus-circle"></i></td>
        {:else}
            <td><i on:click="{(e) => {
                $user.pickedSubjects.push(subject);
                updateStudentPickedSubjects(() => {
                    dispatch('refresh');
                })
                }}" title="Zapísať predmet" class="text-success fas fa-plus-circle"></i></td>
        {/if}
    {:else if action === 'add-taken/remove-taken'}
        {#if $user.takenSubjectCodes && $user.takenSubjectCodes.includes(subject.skratka)}
            <td><i on:click="{(e) => {
                $user.takenSubjects = $user.takenSubjects.filter((sbj) => sbj.skratka !== subject.skratka);
                updateStudentTakenSubjects(() => {
                    dispatch('refresh');
                })
                }}" title="Odstrániť predmet z absolvovaných predmetov" class="text-warning fas fa-times-circle"></i></td>
        {:else}
            <td><i on:click="{(e) => {
                $user.takenSubjects.push(subject);
                updateStudentTakenSubjects(() => {
                    dispatch('refresh');
                });
                }}" title="Absolvovať predmet" class="text-info fas fa-check-circle"></i></td>
        {/if}
    {/if}
{/each}

<style>
    i.fas {
        cursor: pointer;
    }
</style>