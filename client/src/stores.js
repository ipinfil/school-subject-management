import { writable } from 'svelte/store';

export const user = writable({
    loggedIn: false
})

export const program = writable({})