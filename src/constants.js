const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    SERVER_ERROR: 500,
    MOVED_PERMANENTLY: 301,
    REDIRECT: 302,
    NOT_AUTHORIZED: 401
}

const SESSION_SECRET = 'fa9s8dfa9s8f9as8dyf0sa';

module.exports = {
    HTTP_STATUS,
    SESSION_SECRET
};