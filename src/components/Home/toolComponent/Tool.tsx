import { Button, Input, message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { changeStatus, getStatus } from '../../../redux/status_link/slice';

const { TextArea } = Input;

interface Props {
    socket: Socket;
}

export const Tool = ({ socket }: Props) => {
    const dispatch = useAppDispatch();
    const status: any = useAppSelector((state) => state.status.data);
    const [send, setSend] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    const style: React.CSSProperties = {
        pointerEvents: `${status.status === 'Off' ? 'none' : 'auto'}`,
        opacity: `${status.status === 'Off' ? '0.5' : '1'}`,
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
                description: 'Th??ng B??o ???????c Nh???p Kh??ng H???p L???!!!',
                message: 'Xin h??y nh??p l???i th??ng b??o!',
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
                description: 'S??? B??n ???????c Nh???p Kh??ng H???p L???!!!',
                message: 'Xin h??y nh??p l???i s??? b??n!',
            });
        }
    };
    useEffect(() => {
        fetchSattus();
    }, []);
    return (
        <div className="wrap-tool">
            <div className="text send-content">
                <TextArea
                    onChange={(e) => setInput1(e.target.value)}
                    placeholder="Nh???p n???i dung..."
                    className="input"
                    value={input1}
                ></TextArea>
                <Button onClick={onNotification} type="primary" size="large">
                    G???i th??ng b??o
                </Button>
            </div>
            <div className="text send-number-table">
                <TextArea
                    onChange={(e) => setInput2(e.target.value)}
                    placeholder="Nh???p s??? b??n..."
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
                    G???i s??? b??n
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
                    >
                        {status && status.status === 'On'
                            ? 'Tool ??ang b???t'
                            : 'Tool ??ang t???t'}
                    </button>
                    <button
                        onClick={() => {
                            onSubmitAction({
                                title: '??ang ph??n t??ch ...',
                                command: 'Ph??n T??ch',
                            });
                            setSend('Ph??n T??ch');
                        }}
                        className={classNameLon('Ph??n T??ch')}
                        style={style}
                    >
                        ??ang ph??n t??ch
                    </button>
                </div>
                <div className="action chan">
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'Ch???n', command: 'Ch???n' })
                        }
                        className={classNameLon('Ch???n')}
                        style={style}
                    >
                        Ch???n
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
                            onSubmitAction({ title: 'T??i', command: 'T??i' })
                        }
                        className={classNameLon('T??i')}
                        style={style}
                    >
                        T??i
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'R???ng', command: 'R???ng' })
                        }
                        className={classNameLon('R???ng')}
                        style={style}
                    >
                        R???ng
                    </button>
                </div>
                <div className="action le">
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'L???', command: 'L???' })
                        }
                        className={classNameNho('L???')}
                        style={style}
                    >
                        L???
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'C??i', command: 'C??i' })
                        }
                        className={classNameNho('C??i')}
                        style={style}
                    >
                        C??i
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'X???u', command: 'X???u' })
                        }
                        className={classNameNho('X???u')}
                        style={style}
                    >
                        X???u
                    </button>
                    <button
                        onClick={() =>
                            onSubmitAction({ title: 'H???', command: 'H???' })
                        }
                        className={classNameNho('H???')}
                        style={style}
                    >
                        H???
                    </button>
                </div>
            </div>
        </div>
    );
};
