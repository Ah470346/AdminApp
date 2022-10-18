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
                        history.push('/home');
                    }, 2000);
                    // cookie.set('token', originalPromiseResult.token);
                    // cookie.set(
                    //     'refreshToken',
                    //     originalPromiseResult.refreshToken
                    // );
                    onPage('information');
                    cookie.set('status', true);
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
                    }, 2000);
                });
        }
    };
    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    <div className="login100-pic js-tilt" data-tilt>
                        <img src="images/img-01.png" alt="IMG" />
                    </div>

                    <form
                        className="login100-form validate-form"
                        onSubmit={login}
                    >
                        <span className="login100-form-title">
                            Member Login
                        </span>

                        <div
                            className="wrap-input100 validate-input"
                            data-validate="Valid email is required: ex@abc.xyz"
                        >
                            <input
                                className="input100"
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Username"
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i
                                    className="fa fa-envelope"
                                    aria-hidden="true"
                                ></i>
                            </span>
                        </div>

                        <div
                            className="wrap-input100 validate-input"
                            data-validate="Password is required"
                        >
                            <input
                                className="input100"
                                type="password"
                                name="pass"
                                id="password"
                                placeholder="Password"
                            />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i
                                    className="fa fa-lock"
                                    aria-hidden="true"
                                ></i>
                            </span>
                        </div>

                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
