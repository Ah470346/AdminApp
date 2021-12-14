import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router';
import { io } from 'socket.io-client';
import { useAppSelector } from '../hooks';
import Home from './Home/Home';
import LoginPage from './Login/Login';
const socket = io('');

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Main() {
    const history = useHistory();
    const location = useLocation();
    const persist = useAppSelector((state) => state.persist.status);
    const [spin, setSpin] = useState(false);

    useEffect(() => {
        if (persist === true) {
            if (location.pathname !== '/') {
                history.push(location.pathname);
            } else {
                history.push('/home');
            }
        }
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
                        <Home socket={socket}></Home>
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
