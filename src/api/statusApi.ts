import axiosClient from './axiosClient';

const statusApi = {
    getStatus: () => {
        const url = 'v1/api/get_status_tool';
        return axiosClient.get(url);
    },
    changeStatus: (status: string) => {
        const url = 'v1/api/changestatus';
        const data = new FormData();
        data.append('status', status);

        return axiosClient.post(url, data);
    },
    getRandomStatus: () => {
        const url = 'v1/api/get_status_auto';
        return axiosClient.get(url);
    },
    changeRandomStatus: (status: string) => {
        const url = 'v1/api/change_status_auto';
        const data = new FormData();
        data.append('status', status);

        return axiosClient.post(url, data);
    },
};

export default statusApi;
