import axiosClient from './axiosClient';

const getUserApi = {
    getUser: (token: string) => {
        const url = '/user';
        return axiosClient.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

export default getUserApi;
