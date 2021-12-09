import { LoadingOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router';
import { io } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getAllLink } from './../redux/status_link/slice';
import { getUser } from './../redux/user/slice';
import Home from './Home/Home';
import LoginPage from './Login/Login';
const socket = io('http://103.166.183.129:5656');

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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

function Main() {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const onGetuser = () => dispatch(getUser('token'));
    const onGetLink = () => dispatch(getAllLink('token'));
    const persist = useAppSelector((state) => state.persist.status);
    const [dataSource, setDataSource] = useState<DataTable[]>([]);
    const [dataSourceLink, setDataSourceLink] = useState<DataTableLink[]>([]);
    const [spin, setSpin] = useState(false);

    const convertDataLink = (data: any): DataTableLink[] => {
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

    const convertData = (data: any): DataTable[] => {
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

    const fetchData = () => {
        onGetuser()
            .unwrap()
            .then((res: any) => {
                if (res.message === 'Successfuly') {
                    setDataSource(convertData(res.results));
                }
            })
            .catch((err) => {
                message.error({
                    content: 'Server Disconnected',
                    key: 'err',
                    duration: 5,
                });
            });
    };

    const fetchDataLink = () => {
        onGetLink()
            .unwrap()
            .then((res: any) => {
                if (res.message === 'Successfuly') {
                    setDataSourceLink(convertDataLink(res.links));
                }
            })
            .catch((err) => {
                message.error({
                    content: 'Server Disconnected',
                    key: 'err',
                    duration: 5,
                });
            });
    };

    useEffect(() => {
        if (persist === true) {
            if (location.pathname !== '/') {
                history.push(location.pathname);
            } else {
                history.push('/home');
            }
        }
        fetchData();
        fetchDataLink();
        return () => {
            socket.disconnect();
            socket.close();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Spin spinning={spin} indicator={antIcon}>
            <div className="main">
                <Switch>
                    <Route exact path="/">
                        <LoginPage></LoginPage>
                    </Route>
                    <ProtectHome path="/home" persist={persist}>
                        <Home
                            fetchData={fetchData}
                            fetchDataLink={fetchDataLink}
                            socket={socket}
                            dataSource={dataSource}
                            dataSourceLink={dataSourceLink}
                        ></Home>
                    </ProtectHome>
                </Switch>
            </div>
        </Spin>
    );
}

const ProtectHome = ({
    children,
    path,
    persist,
}: {
    children: JSX.Element;
    path: string;
    persist: boolean | undefined;
}) => {
    return (
        <Route
            exact
            path={path}
            render={() =>
                persist === true ? children : <Redirect to="/"></Redirect>
            }
        />
    );
};

export default Main;
