import { message, notification } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie/es6';
import { useAppDispatch } from '../../hooks';
import { postAuth } from '../../redux/auth/slice';
import { setPage, setPersist } from '../../redux/persistLogin/slice';

function Login(props: any) {
    const cookie = new Cookies();
    const history = useHistory();
    const dispatch = useAppDispatch();
    const setPersistCookie = (status: boolean) => dispatch(setPersist(status));
    const onPage = (page: string) => dispatch(setPage(page));
    const onLogin = (user: FormData) => dispatch(postAuth(user));
    const login = (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const form = document.querySelector('.container form');
        const wrapper = document.querySelector('.wrapper');
        const inputUsername =
            document.querySelector<HTMLInputElement>('#username');
        const inputPassword =
            document.querySelector<HTMLInputElement>('#password');
        if (inputUsername?.value === '' || inputPassword?.value === '') {
            notification.error({
                message: 'Empty error!',
                description: 'Username or Password is empty!',
            });
        } else if (inputUsername?.value && inputPassword?.value) {
            form?.classList.add('form-fade');
            wrapper?.classList.add('form-success');
            setTimeout(() => {
                form?.classList.add('form-hidden');
            }, 500);
            message.loading({
                content: 'Loading...',
                key: 'login',
                duration: 0,
            });
            onLogin(data)
                .unwrap()
                .then((originalPromiseResult: any) => {
                    setTimeout(() => {
                        message.success({
                            content: `Login is success!`,
                            key: 'login',
                            duration: 5,
                        });
                        history.push('/information');
                    }, 2000);
                    cookie.set('token', originalPromiseResult.token);
                    cookie.set(
                        'refreshToken',
                        originalPromiseResult.refreshToken
                    );
                    cookie.set('status', true);
                    onPage('information');
                    setPersistCookie(true);
                })
                .catch((rejectedValueOrSerializedError: any) => {
                    setTimeout(() => {
                        message.error({
                            content:
                                rejectedValueOrSerializedError === 'Auth failed'
                                    ? 'Password and Username is Error!'
                                    : 'Server is disconnected!',
                            key: 'login',
                            duration: 5,
                        });
                        form?.classList.remove('form-fade');
                        // form?.classList.remove('form-fade');
                        wrapper?.classList.remove('form-success');
                        setTimeout(() => {
                            form?.classList.remove('form-hidden');
                        }, 500);
                    }, 2000);
                });
        }
    };
    return (
        <div className="wrapper">
            <div className="container">
                <h1>Welcome</h1>
                <form onSubmit={(e) => login(e)} className="form">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                    />
                    <button type="submit" id="login-button">
                        Login
                    </button>
                </form>
            </div>

            <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    );
}

export default Login;
