import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Cookies from 'universal-cookie/es6';
import { ReactComponent as Analysis } from '../../assets/analysis.svg';
import { ReactComponent as LinkList } from '../../assets/link.svg';
import Logout from '../../assets/logout.png';
import { ReactComponent as User } from '../../assets/user.svg';
import { useAppDispatch } from '../../hooks';
import { setPersist } from '../../redux/persistLogin/slice';
import { DataTable, DataTableLink } from '../Main';
import LinkView from './linkComponent/LinkView';
import { TableContent } from './Table';
import { Tool } from './toolComponent/Tool';

interface Props {
    fetchData: () => void;
    fetchDataLink: () => void;
    socket: Socket;
    dataSource: DataTable[];
    dataSourceLink: DataTableLink[];
}

function Home({
    fetchData,
    fetchDataLink,
    socket,
    dataSource,
    dataSourceLink,
}: Props) {
    const cookie = new Cookies();
    const dispatch = useAppDispatch();
    const setPersistCookie = (status: boolean) => dispatch(setPersist(status));
    const [scroll, setScroll] = useState<number>(0);
    const [page, setPage] = useState('User');

    useEffect(() => {
        const wrap_table = document.querySelector<HTMLElement>('.wrap-table');
        const table = document.querySelector<HTMLElement>('.table');
        const th = document.querySelector<HTMLElement>('.ant-table-cell');
        const table_contain =
            document.querySelector<HTMLElement>('.table-contain');
        if (wrap_table) {
            wrap_table.style.height = `${window.innerHeight - 65}px`;
        }
        if (table && table_contain && th) {
            table_contain.style.height = `${table.offsetHeight - 65}px`;
            setScroll(table.offsetHeight - th.offsetHeight - 105);
        }
        socket.on('event-users', (socket) => {
            if (socket === 'Events') {
                fetchData();
                fetchDataLink();
            }
        });
    }, []);
    return (
        <section className="wrap-home">
            <Row style={{ height: '100%' }}>
                <Col
                    span={4}
                    xl={{ span: 4 }}
                    lg={{ span: 5 }}
                    className="slide-menu"
                >
                    <div className="header">
                        <Link
                            onClick={() => {
                                window.location.reload();
                            }}
                            to="/home"
                        >
                            Administrators
                        </Link>
                    </div>
                    <div className="menu">
                        <ul>
                            <li
                                onClick={() => setPage('User')}
                                className={`${page === 'User' && 'active'}`}
                            >
                                <User></User> Danh Sách Users
                            </li>
                            <li
                                onClick={() => setPage('Tool')}
                                className={`${page === 'Tool' && 'active'}`}
                            >
                                <Analysis></Analysis> Đọc Lệnh
                            </li>
                            <li
                                onClick={() => setPage('Link')}
                                className={`${page === 'Link' && 'active'}`}
                            >
                                <LinkList></LinkList> Danh Sách Link
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col
                    span={20}
                    xl={{ span: 20 }}
                    lg={{ span: 19 }}
                    className="content"
                >
                    <div className="header">
                        <div className="left"></div>
                        <Link
                            onClick={() => {
                                setPersistCookie(false);
                                cookie.remove('status');
                            }}
                            className="right"
                            to={'/'}
                        >
                            <img src={Logout} alt="#" />
                            Logout
                        </Link>
                    </div>
                    <div className="wrap-table">
                        {page === 'User' && (
                            <div className="table">
                                <div className="table-header">
                                    <p className="title">
                                        Danh Sách Thành Viên
                                    </p>
                                </div>
                                <div className="table-contain">
                                    <TableContent
                                        scroll={scroll}
                                        dataSource={dataSource}
                                    ></TableContent>
                                </div>
                            </div>
                        )}
                        {page === 'Tool' && <Tool socket={socket}></Tool>}
                        {page === 'Link' && (
                            <LinkView
                                socket={socket}
                                dataSource={dataSourceLink}
                            ></LinkView>
                        )}
                    </div>
                </Col>
            </Row>
        </section>
    );
}

export default Home;
