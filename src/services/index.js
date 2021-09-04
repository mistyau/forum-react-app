import axios from 'axios';
import qs from 'qs';

// new instance of axios with custom config
export const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {'Content-Type': 'application/json'}
});

// request interceptor: set access token in header for every restricted request
instance.interceptors.request.use(
    config => {
        const token = JSON.parse(sessionStorage.getItem('token'));
        if (token && config.url.includes('users')) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

// response interceptor
instance.interceptors.response.use((response) => {
    return response;
}, async function (error) {
    const originalRequest = error.config;

    // if the refresh token is not valid either, then user needs to login again
    if (error.response.status === 400 && originalRequest.url === 'http://localhost:8080/api/v1/auth/refresh/token') {
        window.location.href = '/login';
        return Promise.reject(error);
    }

    // status code should be 401, but i haven't changed it on the backend, so it's 403 for now
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        const url = 'http://localhost:8080/api/v1/auth/refresh/token';
        const data = {
            'grant_type': 'refresh_token',
            'refresh_token': JSON.parse(sessionStorage.getItem('refresh_token'))
        };

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url,
        };

        return axios(options).then(res => {
            if (res.status === 200) {
                console.log(res.data);
                // 1. Store the token
                sessionStorage.setItem('token', JSON.stringify(res.data.access_token));
                sessionStorage.setItem('refresh_token', JSON.stringify(res.data.refresh_token));

                // 2. Change authorization header
                originalRequest.headers['Authorization'] = 'Bearer ' + JSON.parse(sessionStorage.getItem('token'));

                // 3. return originalRequest object with Axios
                return axios(originalRequest);
            }
        });
    }
});
