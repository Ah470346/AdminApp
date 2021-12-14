import { message } from 'antd';
import { getAllLink } from './redux/status_link/slice';
import { store } from './redux/store';
import { getUser } from './redux/user/slice';
import { DataTable, DataTableLink } from './type';

export const fetchDataTable = () => {
    store
        .dispatch(getUser(''))
        .unwrap()
        .then((res: any) => {})
        .catch((err) => {
            message.error({
                content: 'Server Disconnected',
                key: 'err',
                duration: 5,
            });
        });
};

export const fetchDataLink = () => {
    store
        .dispatch(getAllLink(''))
        .unwrap()
        .then((res: any) => {})
        .catch((err) => {
            message.error({
                content: 'Server Disconnected',
                key: 'err',
                duration: 5,
            });
        });
};

export const convertDataLink = (data: any): DataTableLink[] => {
    const arr: DataTableLink[] = [];
    for (let i = 0; i < data.length; i++) {
        arr.push({
            key: (data[i].id + 1).toString(),
            id: data[i].id.toString(),
            name: data[i].name,
            url: data[i].link_name,
            date: data[i].date_create.replaceAll('-', '/'),
            role: data[i].role,
        });
    }
    return arr;
};

export const convertData = (data: any): DataTable[] => {
    const arr: DataTable[] = [];
    for (let i = 0; i < data.length; i++) {
        arr.push({
            key: (data[i].id + 1).toString(),
            id: data[i].id.toString(),
            name: data[i].phone_number,
            email: data[i].fullname,
            date: data[i].create_date.replaceAll('-', '/'),
            code: data[i].code ? data[i].code : '',
            status: data[i].status,
            lock: data[i].lock_user,
        });
    }
    return arr;
};
