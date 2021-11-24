import axiosClient from './axiosClient';

const entryApi = {
    getImage: (token: string) => {
        const url = '/getImage';
        return axiosClient.get(url, {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
    },
    submit: (data: FormData, token: string) => {
        const url = '/submit';
        return axiosClient.post(url, data, {
            headers: {
                'content-type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
    },
    return_image: (data: FormData) => {
        const url = '/return_image';
        return axiosClient.post(url, data, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });
    },
};

export default entryApi;
