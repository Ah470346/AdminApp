import axiosClient from './axiosClient';

const authApi = {
    login: (data: FormData) => {
        const url = '/api/users/signinweb';
        return axiosClient.post(url, data);
    },
};

export default authApi;
