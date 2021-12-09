import axiosClient from './axiosClient';

const statusApi = {
    getStatus: () => {
        const url = '/api/get_status_tool';
        return axiosClient.get(url);
    },
    changeStatus: (status: string) => {
        const url = '/api/changestatus';
        const data = new FormData();
        data.append('status', status);

        return axiosClient.post(url, data);
    },
};

export default statusApi;
