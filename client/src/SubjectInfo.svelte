<script>
    import { program } from "./stores";

    export let subject;
    import {fade} from 'svelte/transition';

    const findSubjectType = (subject) => {
        let programSubjectsFiltered = $program.subjects.filter((obj) => obj.skratka === subject.skratka);

        if (!programSubjectsFiltered.length) {
            return '-';
        }

        return programSubjectsFiltered[0].typ.toUpperCase();
    }
</script>

<div class="modal fade" tabindex="-1" id="subject-info" transition:fade="{{duration: 300}}">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{subject ? subject.nazov + ' - ' + subject.skratka : ''}</h5>
                    <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    />
            </div>
            <div class="modal-body">
                {#if subject}
                    <p><strong>Kreditné ohodnotenie: </strong>{subject.kreditneOhodnotenie} kreditov</p>
                    <p><strong>Odporúčaný ročník: </strong>{subject.rocnik}.</p>
                    <p><strong>Rozsah: </strong>{subject.rozsah}</p>
                    <p><strong>Semester: </strong>{ subject.semester }</p>
                    <p><strong>Typ: </strong>{ findSubjectType(subject) }</p>
                    <p><strong>Vyučujúci: </strong>{ subject.vyucujuci }</p>
                {/if}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                >Zatvoriť</button>
            </div>
        </div>
    </div>
</div>

<style>
</style>
