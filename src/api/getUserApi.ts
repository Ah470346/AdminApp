import { DataCode, DataLock, DataStatus } from '../type';
import axiosClient from './axiosClient';

const getUserApi = {
    getUser: () => {
        const url = '/api/getusers';
        return axiosClient.get(url);
    },
    changeLock: (lock: DataLock) => {
        const data = new FormData();
        const url = '/api/users/change_lock';
        data.append('lock_user', lock.lock_user);
        data.append('id', lock.id);
        return axiosClient.post(url, data);
    },
    changeStatus: (status: DataStatus) => {
        const data = new FormData();
        const url = '/api/users/change_status';
        data.append('status', status.status);
        data.append('id', status.id);
        return axiosClient.post(url, data);
    },
    changeCode: (code: DataCode) => {
        const data = new FormData();
        const url = '/api/users/add_code';
        data.append('content', code.content);
        data.append('id', code.id);
        return axiosClient.post(url, data);
    },
    removeUser: (id: string) => {
        const data = new FormData();
        const url = '/api/users/delete_user';
        data.append('id', id);
        return axiosClient.post(url, data);
    },
};

export default getUserApi;
