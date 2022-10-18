import axiosClient from './axiosClient';

const authApi = {
    login: (data: FormData) => {
        const url = 'v1/api/users/signinweb';
        return axiosClient.post(url, data);
    },
    changePassword: (data: FormData) => {
        const url = 'v1/api/users/change_pas_sweb';
        return axiosClient.post(url, data);
    },
};

export default authApi;
