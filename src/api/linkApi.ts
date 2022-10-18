import { DataLink } from '../type';
import axiosClient from './axiosClient';

const statusApi = {
    getAll: () => {
        const url = 'v1/api/get_all_link';
        return axiosClient.get(url);
    },
    changeLink: (link: DataLink) => {
        const data = new FormData();
        const url = 'v1/api/change_link';
        data.append('link_name', link.link_name);
        data.append('id', link.id);
        data.append('name', link.name ? link.name : '');
        return axiosClient.post(url, link);
    },
    addLink: (link: DataLink) => {
        const data = new FormData();
        const url = 'v1/api/insert_link';
        data.append('link_name', link.link_name);
        data.append('name', link.name ? link.name : '');
        data.append('role', link.role ? link.role : '');
        return axiosClient.post(url, link);
    },
    removeLink: (link: DataLink) => {
        const data = new FormData();
        const url = 'v1/api/delete_link';
        data.append('id', link.id);
        data.append('role', link.role ? link.role : '');
        return axiosClient.post(url, link);
    },
};

export default statusApi;
