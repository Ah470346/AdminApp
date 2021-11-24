import axiosClient from './axiosClient';

const refreshTokenApi = {
    refresh: (data: string) => {
        const url = '/refresh';
        const dataForm = new FormData();
        dataForm.append('refreshToken', data);
        return axiosClient.post(url, dataForm, {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${data}`,
            },
        });
    },
};

export default refreshTokenApi;
