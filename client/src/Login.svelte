<script>
    import { user } from "./stores";
    export let registered;

    function handleLogin(event) {
        fetch('http://localhost:5678/api/users/login', {
            method: "post",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: $user.username})
        })
        .then(res => res.json())
        .then(data => {
            $user.loggedIn = data.status;

            if (data.user) {
                $user.username = data.user.name;
            }

            if (data.extra && data.extra == 'registered') {
				registered = true;
			}
        });
    }
</script>

<div id="login-container" class="row full-height align-items-center">
    <div class="col">
        <div class="row">
            <div class="col">
                <h1 class="mb-3">Vyskladajte si rozvrh podľa Vášho študijného plánu.</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <form id="login-form" on:submit|preventDefault="{handleLogin}" class="row">
                    <div class="col mb-3">
                        <label for="id"><strong>Zadajte svoje univerzitné identifikačné číslo:</strong></label>
                        <input type="text" class="form-control form-control-lg" bind:value="{$user.username}">
                    </div>
                    <div class="col mb-3">
                        <div class="row align-items-end h-100">
                            <div class="col">
                                <button type="submit" id="login-btn" class="btn btn-primary btn-lg">Prihlásiť sa</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
#login-container {
    background: no-repeat url("/index-bg.svg");
    background-position: right 0% top 50%;
    background-size: 500px;
}

#login-btn {
    min-width: 230px;
}
</style>