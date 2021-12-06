import { Col, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import Logout from '../../assets/logout.png';
import { ReactComponent as User } from '../../assets/user.svg';
import { TableContent } from './Table';

const { Search } = Input;

const socket = io('http://192.168.0.24:5656');

function Home() {
    const [scroll, setScroll] = useState<number>(0);

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
        // socket.on('event-users', (socket) => {
        //     console.log(socket);
        // });
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
                            <li>
                                <User></User> Danh Sách Users
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
                        <div className="right">
                            <img src={Logout} alt="#" />
                            Logout
                        </div>
                    </div>
                    <div className="wrap-table">
                        <div className="table">
                            <div className="table-header">
                                <p className="title">Danh Sách Thành Viên</p>
                            </div>
                            <div className="table-contain">
                                <TableContent scroll={scroll}></TableContent>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </section>
    );
}

export default Home;
