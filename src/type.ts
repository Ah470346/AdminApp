import Cookies from 'universal-cookie';
import refreshTokenApi from './api/refreshTokenApi';

const cookie = new Cookies();

export interface DataTable {
    key: string;
    id: string;
    name: string;
    email: string;
    date: string;
    code: string;
    status: string;
    lock: string;
}

export interface DataTableLink {
    key: string;
    id: string;
    name: string;
    role: string;
    date: string;
    url: string;
}

export type DataLock = {
    lock_user: string;
    id: string;
};

export type DataStatus = {
    status: string;
    id: string;
};

export type DataLink = {
    link_name: string;
    id: string;
    name?: string;
    create_date?: string;
    role?: string;
};

export type DataLogin = {
    username: string;
    password: string;
};

export type DataCode = {
    content: string;
    id: string;
};

export const refresh = (reload: boolean) => {
    cookie.remove('token');
    cookie.remove('refreshToken');
    cookie.set('status', false);
    if (reload) {
        window.location.reload();
    }
};

export const checkToken = async (status: boolean) => {
    const refresh = cookie.get('refreshToken');
    if (refresh === undefined || status === false) {
        cookie.remove('token');
        cookie.remove('refreshToken');
        cookie.remove('status');
        window.location.reload();
    } else {
        try {
            const response: any = await refreshTokenApi.refresh(refresh);
            if (response) {
                cookie.set('token', response.token);
                cookie.set('refreshToken', response.refreshToken);
                return { status: 'Done', token: response.token };
            }
        } catch (err: any) {
            return err.response.data.message;
        }
    }
};
