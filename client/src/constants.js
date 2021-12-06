const baseUrl = 'http://localhost:5678/api/';

const defaultRequestOptions = {
    method: 'get',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

export {
    baseUrl,
    defaultRequestOptions
};