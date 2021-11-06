<script>
    import { user } from "./stores";
    import { program } from "./stores";
    import SubjectPaginator from "./SubjectPaginator.svelte";
    import SubjectInfo from "./SubjectInfo.svelte";
    import { onMount } from 'svelte';

    let allSubjects = [];
    let pickedSubjects = [];
    let takenSubjects = [];
    let rightSideSubjects = [];

    let leftActive = 'both';
    let rightActive = 'choice';

    let detailSubject;
    let modal;

    const fetchStudentSubjects = (callback = null) => {
        // fetch picked and taken subjects
        fetch('http://localhost:5678/api/students/subjects', {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            $user.pickedSubjects = data.subjects ?? [];
            $user.takenSubjects = data.taken_subjects ?? [];
            $user.pickedSubjectCodes = data.subjects ? data.subjects.map((subject) => subject.skratka) : [];
            $user.takenSubjectCodes = data.taken_subjects ? data.taken_subjects.map((subject) => subject.skratka) : [];

            pickedSubjects = $user.pickedSubjects ?? [];
            takenSubjects = $user.takenSubjects ?? [];

            rightActive = 'choice';
            leftActive = 'both';

            if (callback) {
                callback();
            }
        });
    };

    const fetchProgramSubjects = (callback = null) => {
        // fetch all program subjects
        fetch('http://localhost:5678/api/programs/subjects', {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {
            allSubjects = data.subjects;
            $program.subjects = allSubjects;

            rightActive = 'choice';
            leftActive = 'both';
            rightSideSubjects = $program.subjects;

            if (callback) {
                callback();
            }
        });
    };

    onMount(() => {
        fetchStudentSubjects();
        fetchProgramSubjects();
        modal = new bootstrap.Modal(document.getElementById("subject-info"), {});
    });

    let pickedSubjectsCreditSum = 0;
    $: pickedSubjectsCreditSum = pickedSubjects.reduce((carry, current) => { return (carry ?? 0) + parseInt(current.kreditneOhodnotenie); }, 0);

</script>

<div class="container-fluid">
    <div class="row mt-4 mx-2">
        <div class="col border-end">
            <div class="row mb-3">
                <div class="col">
                    <h2 class="">Prehľad zapísaných predmetov</h2>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" class:active="{leftActive == 'both'}" href="#" on:click="{() => {
                                pickedSubjects = $user.pickedSubjects;
                                leftActive = 'both';
                            }}">Zimný a letný semester</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" class:active="{leftActive == 'winter'}" href="#" on:click="{() => {
                                pickedSubjects = $user.pickedSubjects.filter((subject) => subject.semester === "Z");
                                leftActive = 'winter';
                                }}">Zimný semester</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" class:active="{leftActive == 'summer'}" on:click="{() => {
                                pickedSubjects = $user.pickedSubjects.filter((subject) => subject.semester === "L");
                                leftActive = 'summer';
                                }}">Letný semester</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <table class="table table-striped table-hover fs-6">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Názov</th>
                                <th scope="col">Semester</th>
                                <th scope="col">Kredit</th>
                                <th scope="col">Prerekvizity</th>
                                <th scope="col" colspan="2"></th>
                            </tr>
                        </thead>
                        <SubjectPaginator
                            subjects={pickedSubjects}
                            fields={['nazov', 'semester', 'kreditneOhodnotenie', 'prerekvizity']}
                            actions="{['info', 'add/remove']}"
                            bind:detailSubject={detailSubject}
                            bind:modal="{modal}"
                            on:refresh="{(e) => {
                                fetchStudentSubjects();
                                fetchProgramSubjects();
                            }}"
                        />
                        <tfoot>
                            <tr class="table-info">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td class:text-danger="{leftActive == 'both' ? pickedSubjectsCreditSum < 60 : pickedSubjectsCreditSum < 30}">{pickedSubjectsCreditSum}</td>
                                <td></td>
                                <td></td>
                                <td colspan="3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="row mb-3">
                <div class="col">
                    <h2 class="">Prehľad predmetov študijného programu</h2>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link" class:active="{rightActive == 'choice'}" href="#" on:click="{() => {
                                rightSideSubjects = allSubjects;
                                rightActive = 'choice';
                            }}" aria-current="page">Voľba predmetov</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" class:active="{rightActive == 'taken'}" href="#" on:click="{() => {
                                rightSideSubjects = $user.takenSubjects;
                                rightActive = 'taken';
                                }}">Absolvované predmety</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-striped table-hover fs-6">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Názov predmetu</th>
                                <th scope="col">Kód</th>
                                <th scope="col">Semester</th>
                                <th scope="col">Kredit</th>
                                <th scope="col">Typ</th>
                                <th scope="col" colspan="3"></th>
                            </tr>
                        </thead>
                        <SubjectPaginator
                            subjects={rightSideSubjects}
                            fields={['nazov', 'skratka', 'semester', 'kreditneOhodnotenie', 'typ']}
                            actions="{['info', 'add/remove', 'add-taken/remove-taken']}"
                            bind:detailSubject={detailSubject}
                            bind:modal="{modal}"
                            on:refresh="{(e) => {
                                fetchStudentSubjects();
                                fetchProgramSubjects();
                            }}"
                        />
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<SubjectInfo bind:subject={detailSubject} />

<style>

</style>