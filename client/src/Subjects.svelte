<script>
    import { user } from "./stores";
    import { onMount } from 'svelte';

    let allNotPickedSubjects = [];

    onMount(() => {
        fetch('http://localhost:5678/api/programs/' + $user.program + '/subjects', {
            method: 'get',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(data => {

            for (let program of data.programs) {
                let programName = program.skratka + ' - ' + program.popis;
                programChoices.push({key: program.skratka, name: programName});
            }

            programChoices = programChoices;
        });
    });
</script>

<div class="container-fluid">
    <div class="row mt-4 mx-2">
        <div class="col border-end">
            <div class="row mb-3">
                <div class="col">
                    <h2 class="">Prehľad zvolených predmetov</h2>
                </div>
            </div>

            <div class="row mb-2">
                <div class="col">
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="#">Zimný a letný semester</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Zimný semester</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Letný semester</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Názov predmetu</th>
                                <th scope="col">Semester</th>
                                <th scope="col">Počet kreditov</th>
                                <th scope="col">Kontrola prerekvizít</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>-</td>
                                <td>-</td>
                                <td>32</td>
                                <td><strong class="text-success">✓</strong></td>
                                <td><i class="text-danger fas fa-minus-circle"></i></td>
                            </tr>
                            <tr class="table-info border-top">
                                <td></td>
                                <td>-</td>
                                <td>-</td>
                                <td>32</td>
                                <td><strong class="text-success">✓</strong></td>
                                <td>-</td>
                            </tr>
                        </tbody>
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
                            <a class="nav-link active" aria-current="page" href="#">Voľba predmetov</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Absolvované predmety</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Názov predmetu</th>
                                <th scope="col">Semester</th>
                                <th scope="col">Vyučujúci</th>
                                <th scope="col" colspan="2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>-</td>
                                <td>-</td>
                                <td>32</td>
                                <td><i class="text-primary fas fa-info-circle"></i></td>
                                <td><i class="text-success fas fa-plus-circle"></i></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<style>

</style>