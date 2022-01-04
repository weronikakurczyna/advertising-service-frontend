import jwtDecode from "jwt-decode";
const loginUrl = 'http://localhost:8080/api/user/login';
const registerUrl = 'http://localhost:8080/api/user/register';

export const loginUserApiCall = async ({email, password}) => {
    try {
        const body = JSON.stringify({email, password});
        return fetch(loginUrl, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json().then(data => {
                    return {
                        token: data.token,
                        email: data.email
                    }
                })
            } else {
                throw 'Authentication failed!'
            }
        })
    } catch (err) {
        throw err;
    }
};



export const registerUserApiCall = async ({email, currentPassword, newPassword, name, location, phoneNumber, image}) => {
    try {
        const body = JSON.stringify({email, currentPassword, newPassword, name, location, phoneNumber, image});
        return fetch(registerUrl, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                return response.json().then(data => {
                    return {
                        token: data.token,
                        email: data.email
                    }
                })
            } else {
                throw 'Authentication failed!'
            }
        })
    } catch (err) {
        throw err;
    }
};

export const getUserApiCall = async ({token}) => {
    try {
        let url = 'http://localhost:8080/api/user/me';
        return fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            if (response.ok) {
                return response.json().then(data => {
                    return data
                })
            } else {
                throw 'Fetching user failed!'
            }
        })
    } catch (error) {
        throw error;
    }
};


export const getExpirationTimeFromToken = (token) => {
    const {exp} = jwtDecode(token);
    return exp;
};

export const getRemainingTimeFromToken = (expirationTime) => {
    const currentTime = new Date().getTime();
    const receivedExpirationTime = expirationTime * 1000;
    //const remainingTime = receivedExpirationTime - currentTime;
    const remainingTime = 1000000;
    return remainingTime;
};



