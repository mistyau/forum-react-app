// Custom React hook

import { useState } from 'react';

export default function useToken() {

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const usernameString = sessionStorage.getItem('username');
        const refreshString = sessionStorage.getItem('refresh_token');

        const user = { token:           JSON.parse(tokenString),
                       username:        JSON.parse(usernameString),
                       refresh_token:   JSON.parse(refreshString)};
        return user;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken.access_token));
        sessionStorage.setItem('username', JSON.stringify(userToken.username));
        sessionStorage.setItem('refresh_token', JSON.stringify(userToken.refresh_token));
        setToken({ token: userToken.access_token, username: userToken.username, refresh_token: userToken.refresh_token }); // should only set state once
    };

    return {
        setToken: saveToken,
        token
    }
}