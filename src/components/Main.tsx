import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks';
import Home from './Home/Home';
import LoginPage from './Login/Login';

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
                    <Route exact path="/home">
                        <Home></Home>
                    </Route>
                </Switch>
            </div>
        </Spin>
    );
}

// const ProtectHome = ({
//     children,
//     path,
//     persist,
// }: {
//     children: JSX.Element;
//     path: string;
//     persist: boolean | undefined;
// }) => {
//     return (
//         <Route
//             exact
//             path={path}
//             render={() =>
//                 persist === true ? children : <Redirect to="/"></Redirect>
//             }
//         />
//     );
// };

export default Main;
