import axiosClient from './axiosClient';

const authApi = {
    login: (data: FormData, param?: string) => {
        const url = '/login';
        return axiosClient.post(url, data, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
    },
    register: (data: FormData, param?: string) => {
        const url = '/select_user_login';
        return axiosClient.post(url, data);
    },
};

export default authApi;
