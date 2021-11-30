import React, { useState } from 'react';
import VBPO from '../assets/VBPO.png';
import Logout from '../assets/logout.png';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { setPage, setPersist } from '../redux/persistLogin/slice';
import { useAppSelector, useAppDispatch } from '../hooks';
import { returnImage } from '../redux/entry/slice';

function Header(props: any) {
    const dispatch = useAppDispatch();
    const page = useAppSelector((state) => state.persist.page);
    const data = useAppSelector((state) => state.entry.data);
    const returnImageInfo = (data: FormData) => dispatch(returnImage(data));
    const onPersist = (persist: boolean) => dispatch(setPersist(persist));
    const onPage = (page: string) => dispatch(setPage(page));
    const cookie = new Cookies();
    const return_image = (data: any) => {
        if (data.imageId) {
            const formReturnImage = new FormData();
            formReturnImage.append('imageId', data.imageId.toString());
            formReturnImage.append('tableform', data.tableform);

            returnImageInfo(formReturnImage)
                .unwrap()
                .then((res: any) => {
                    console.log(res.message);
                });
        }
    };
    return (
        <header>
            <nav className="navbar">
                <div className="left">
                    <div className="brand">
                        <img src={VBPO} alt="loading..." />
                    </div>
                    <div className="information">
                        <Link
                            className={
                                page === 'information' ? 'active' : 'normal'
                            }
                            onClick={() => {
                                return_image(data);
                                onPage('information');
                            }}
                            to="/information"
                        >
                            Information
                        </Link>
                    </div>
                    <div className="entry">
                        <Link
                            className={page === 'entry' ? 'active' : 'normal'}
                            onClick={() => {
                                onPage('entry');
                            }}
                            to="/entry"
                        >
                            Entry
                        </Link>
                    </div>
                </div>
                <div className="right">
                    <Link
                        to="/"
                        onClick={() => {
                            return_image(data);
                            cookie.remove('token');
                            cookie.remove('refreshToken');
                            cookie.set('status', false);
                            onPersist(false);
                        }}
                    >
                        <img src={Logout} alt="error" />
                    </Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
