function get(key) {
    return JSON.parse(sessionStorage.getItem(key))
}

function set(key, val) {
    sessionStorage.setItem(key, JSON.stringify(val));
}

export const sessionService = {
    get, set
}