import axiosClient from './axiosClient';

const getUserApi = {
    getUser: (token: string) => {
        const url = '/user';
        return axiosClient.get(url, {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
    },
    changePassword: (user: FormData) => {
        const url = 'changePassword';
        return axiosClient.post(url, user, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
    },
};

export default getUserApi;
