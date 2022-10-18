import { Button, Input, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
    changeRandomStatus,
    changeStatus,
    getRandomStatus,
    getStatus,
} from '../../../redux/status_link/slice';

const { TextArea } = Input;

interface Props {
    socket: Socket;
}

export const Tool = ({ socket }: Props) => {
    const dispatch = useAppDispatch();
    const status: any = useAppSelector((state) => state.status.data);
    const random: any = useAppSelector((state) => state.status.random);
    const [send, setSend] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const style: React.CSSProperties = {
        pointerEvents: `${
            status.status === 'Off' || random.status === 'On' ? 'none' : 'auto'
        }`,
        opacity: `${
            status.status === 'Off' || random.status === 'On' ? '0.5' : '1'
        }`,
    };

    const styleStatus: React.CSSProperties = {
        pointerEvents: `${random.status === 'On' ? 'none' : 'auto'}`,
        opacity: `${random.status === 'On' ? '0.5' : '1'}`,
    };

    const styleRadom: React.CSSProperties = {
        pointerEvents: `${status.status === 'On' ? 'none' : 'auto'}`,
        opacity: `${status.status === 'On' ? '0.5' : '1'}`,
    };
    const classNameLon = (a: string) =>
        `btn ${send === a ? 'send-lon' : 'hover'}`;
    const classNameNho = (a: string) =>
        `btn ${send === a ? 'send-nho' : 'hover'}`;
    const onSubmitAction = ({
        title,
        command,
    }: {
        title: string;
        command: string;
    }) => {
        socket.emit('send-command', { title, command });
        setSend(command);
    };

    const onGetStatus = () => {
        dispatch(getStatus('s'));
    };

    const onGetRandomStatus = () => {
        dispatch(getRandomStatus('s'));
    };

    const onChangeStatus = async (status: string) => {
        try {
            const response = await dispatch(changeStatus(status));
            fetchSattus();
            if (status === 'Off') {
                setSend('');
            }
            socket.emit('send-status-tool', status);
        } catch (err) {
            message.error({
                content: 'server disconnected!',
                key: 'err',
                duration: 5,
            });
        }
    };

    const onChangeRandomStatus = async (status: string) => {
        try {
            const response = await dispatch(changeRandomStatus(status));
            fetchRandomStatus();
            if (status === 'Off') {
                setSend('');
            }
            socket.emit('send-status-random', status);
        } catch (err) {
            message.error({
                content: 'server disconnected!',
                key: 'err',
                duration: 5,
            });
        }
    };

    const fetchSattus = async () => {
        try {
            const response = await onGetStatus();
        } catch (error) {
            message.error({
                content: 'server disconnected!',
                key: 'err',
                duration: 5,
            });
        }
    };

    const fetchRandomStatus = async () => {
        try {
            const response = await onGetRandomStatus();
        } catch (error) {
            message.error({
                content: 'server disconnected!',
                key: 'err',
                duration: 5,
            });
        }
    };
    const onNotification = () => {
        if (input1 && input1 !== '') {
            try {
                socket.emit('send-notification', input1, (res: any) => {
                    message.success({
                        content: 'Submit successful!',
                        key: 'ok',
                        duration: 5,
                    });
                });
                setInput1('');
            } catch (err) {
                message.error({
                    content: 'server disconnected!',
                    key: 'err',
                    duration: 5,
                });
                setInput1('');
            }
        } else {
            notification.error({
                description: 'Thông Báo Được Nhập Không Hợp Lệ!!!',
                message: 'Xin hãy nhâp lại thông báo!',
            });
        }
    };
    const onTableNumber = () => {
        if (input2 && input2 !== '') {
            try {
                socket.emit('send-number-table', input2, (res: any) => {
                    message.success({
                        content: 'Submit successful!',
                        key: 'ok',
                        duration: 5,
                    });
                });
                setInput2('');
            } catch (err) {
                message.error({
                    content: 'server disconnected!',
                    key: 'err',
                    duration: 5,
                });
                setInput2('');
            }
        } else {
            notification.error({
                description: 'Số Bàn Được Nhập Không Hợp Lệ!!!',
                message: 'Xin hãy nhâp lại số bàn!',
            });
        }
    };
    useEffect(() => {
        fetchSattus();
        fetchRandomStatus();
    }, []);

    return (
        <div className="wrap-tool">
            <div className="text send-content">
                <TextArea
                    onChange={(e) => setInput1(e.target.value)}
                    placeholder="Nhập nội dung..."
                    className="input"
                    value={input1}
                ></TextArea>
                <Button onClick={onNotification} type="primary" size="large">
                    Gửi thông báo
                </Button>
            </div>
            <div className="text send-number-table">
                <TextArea
                    onChange={(e) => setInput2(e.target.value)}
                    placeholder="Nhập số bàn..."
                    className="input"
                    value={input2}
                ></TextArea>
                <Button
                    onClick={onTableNumber}
                    ghost
                    type="primary"
                    danger
                    size="large"
                >
                    Gửi số bàn
                </Button>
            </div>
            <div className="send-action">
                <div className="action process">
                    <button
                        onClick={() => {
                            const data =
                                status && status.status === 'On' ? 'Off' : 'On';
                            onChangeStatus(data);
                        }}
                        className={`btn ${
                            status && status.status === 'On' ? 'open' : 'hover'
                        }`}
                        style={styleStatus}
                    >
                        {status && status.status === 'On'
                            ? 'Tool đang bật'
                            : 'Tool đang tắt'}
                    </button>
                    <button
                        onClick={() => {
                            const data =
                                random && random.status === 'On' ? 'Off' : 'On';
                            onChangeRandomStatus(data);
                        }}
                        className={`btn ${
                            random && random.status === 'On' ? 'open' : 'hover'
                        }`}
                        style={styleRadom}
                    >
                        {random && random.status === 'On'
                            ? 'Auto đang bật'
                            : 'Auto đang tắt'}
                    </button>
                    <button
                        onClick={() => {
                            onSubmitAction({
                                title: 'Đang phân tích ...',
                                command: 'Phân Tích',
                            });
                            setSend('Phân Tích');
                        }}
                        className={classNameLon('Phân Tích')}
                        style={style}
                    >
                        Đang phân tích
                    </button>
                </div>
                <div className="action chan">
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Chẵn', command: 'Chẵn' })
                        }
                        className={classNameLon('Chẵn')}
                        style={style}
                    >
                        Chẵn
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Con', command: 'Con' })
                        }
                        className={classNameLon('Con')}
                        style={style}
                    >
                        Con
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Tài', command: 'Tài' })
                        }
                        className={classNameLon('Tài')}
                        style={style}
                    >
                        Tài
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Rồng', command: 'Rồng' })
                        }
                        className={classNameLon('Rồng')}
                        style={style}
                    >
                        Rồng
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({
                                title: '3 Trắng',
                                command: '3 Trắng',
                            })
                        }
                        className={classNameLon('3 Trắng')}
                        style={style}
                    >
                        3 Trắng
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({
                                title: 'Tứ Trắng',
                                command: 'Tứ Trắng',
                            })
                        }
                        className={classNameLon('Tứ Trắng')}
                        style={style}
                    >
                        Tứ Trắng
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({
                                title: 'Sấp Đôi',
                                command: 'Sấp Đôi',
                            })
                        }
                        className={classNameLon('Sấp Đôi')}
                        style={style}
                    >
                        Sấp Đôi
                    </button>
                </div>
                <div className="action le">
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Lẻ', command: 'Lẻ' })
                        }
                        className={classNameNho('Lẻ')}
                        style={style}
                    >
                        Lẻ
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Cái', command: 'Cái' })
                        }
                        className={classNameNho('Cái')}
                        style={style}
                    >
                        Cái
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Xỉu', command: 'Xỉu' })
                        }
                        className={classNameNho('Xỉu')}
                        style={style}
                    >
                        Xỉu
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Hổ', command: 'Hổ' })
                        }
                        className={classNameNho('Hổ')}
                        style={style}
                    >
                        Hổ
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: '3 Đỏ', command: '3 Đỏ' })
                        }
                        className={classNameNho('3 Đỏ')}
                        style={style}
                    >
                        3 Đỏ
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Tứ Đỏ', command: 'Tứ Đỏ' })
                        }
                        className={classNameNho('Tứ Đỏ')}
                        style={style}
                    >
                        Tứ Đỏ
                    </button>
                </div>
            </div>
        </div>
    );
};
