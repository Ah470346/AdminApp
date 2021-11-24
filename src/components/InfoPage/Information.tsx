import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { ReactComponent as Next } from '../../assets/next.svg';
import { Link } from 'react-router-dom';
import { getUser } from '../../redux/user/slice';
import { setPage } from '../../redux/persistLogin/slice';
import { useAppDispatch } from '../../hooks';
import { setPersist } from '../../redux/persistLogin/slice';
import { refresh } from '../../type';
import Cookies from 'universal-cookie';
import { message } from 'antd';

function Information(props: any) {
    const cookie = new Cookies();
    const dispatch = useAppDispatch();
    const getUserInfo = (token: string) => dispatch(getUser(token));
    const onPage = (page: string) => dispatch(setPage(page));
    const onPersist = (persist: boolean) => dispatch(setPersist(persist));
    const [user, setUser] = useState('');
    useEffect(() => {
        const info = document.querySelector<HTMLElement>('.wrap-information');
        if (info !== null) {
            info.style.height = `${window.innerHeight - 65}px`;
        }
        getUserInfo(cookie.get('token'))
            .unwrap()
            .then((res: any) => {
                setUser(res.Fullname);
            })
            .catch((err: any) => {
                message.error({ content: err, key: 'out', duration: 5 });
                if (err === 'Server is disconnected!') {
                    refresh(false);
                    onPersist(false);
                }
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="wrap-information">
            <div className="information">
                <p>Hi! &nbsp;&nbsp; {user}</p>
                <table>
                    <tbody>
                        <tr>
                            <td>Số Phiếu Còn lại</td>
                            <td>5678</td>
                        </tr>
                        <tr>
                            <td>Số Phiếu Đã Nhập</td>
                            <td>101</td>
                        </tr>
                    </tbody>
                </table>
                <Link
                    onClick={() => {
                        onPage('entry');
                    }}
                    to="/entry"
                >
                    <Button type="primary" danger>
                        Entry <Next></Next>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default Information;
