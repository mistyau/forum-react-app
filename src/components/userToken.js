// Custom React hook

import { useState } from 'react';

export default function useToken() {

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const usernameString = sessionStorage.getItem('username');

        const user = { token:       JSON.parse(tokenString),
                       username:    JSON.parse(usernameString)};
        return user;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken.token));
        sessionStorage.setItem('username', JSON.stringify(userToken.username));
        setToken({ token: userToken.token, username: userToken.username }); // should only set state once
    };

    return {
        setToken: saveToken,
        token
    }
}