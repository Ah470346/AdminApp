import React, { useState, useEffect } from 'react';
import LoginPage from './Login/Login';
import InfoPage from './InfoPage/Information';
import Header from './Header';
import Entry from './Entry/Entry';
import { Route, Switch, Redirect, useLocation, useHistory } from 'react-router';
import { Spin } from 'antd';
import { useAppSelector, useAppDispatch } from '../hooks';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function Main() {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const persist = useAppSelector((state) => state.persist.status);
    const [spin, setSpin] = useState(false);
    useEffect(() => {
        if (persist === true) {
            if (location.pathname !== '/') {
                history.push(location.pathname);
            } else {
                history.push('/information');
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Spin spinning={spin} indicator={antIcon}>
            <div className="main">
                <Switch>
                    <Route exact path="/">
                        <LoginPage></LoginPage>
                    </Route>
                    <ProtectHome path="/information" persist={persist}>
                        <>
                            <Header></Header>
                            <InfoPage></InfoPage>
                        </>
                    </ProtectHome>
                    <ProtectHome path="/entry" persist={persist}>
                        <>
                            <Header></Header>
                            <Entry></Entry>
                        </>
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
