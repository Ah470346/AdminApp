import { EditOutlined } from '@ant-design/icons';
import { Input, message, Modal, notification } from 'antd';
import React, { useState } from 'react';
import { ReactComponent as Active } from '../../../assets/active.svg';
import { ReactComponent as Inactive } from '../../../assets/inactive.svg';
import { ReactComponent as Lock } from '../../../assets/lock.svg';
import { ReactComponent as Trash } from '../../../assets/trash.svg';
import { ReactComponent as Unlock } from '../../../assets/unlock.svg';
import { useAppDispatch } from '../../../hooks';
import {
    addCode,
    changeLock,
    changeStatus,
    deleteUser,
} from '../../../redux/user/slice';
interface Props {
    status: string;
    lock: string;
    id: string;
}

export const Action = ({ lock, status, id }: Props) => {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const onChangeLock = () => {
        Modal.confirm({
            title: `${lock === 'true' ? 'Mở Khóa User' : 'Khóa User'}`,
            okText: `${lock === 'true' ? 'Mở Khóa' : 'Khóa'}`,
            cancelText: 'Thoát',
            content: `Bạn có chắc chắn muốn ${
                lock === 'true'
                    ? 'Mở khóa tài khoản này?'
                    : 'Khóa tài khoản này?'
            }`,
            onOk: () => {
                message.loading({
                    content: 'Loading...',
                    key: 'lock',
                    duration: 0,
                });
                return new Promise((resolve, rejects) => {
                    dispatch(
                        changeLock({
                            lock_user: lock === 'true' ? 'false' : 'true',
                            id: id,
                        })
                    )
                        .unwrap()
                        .then((res) => {
                            message.success({
                                content: res,
                                key: 'lock',
                                duration: 5,
                            });
                            resolve('');
                        })
                        .catch((err) => {
                            message.error({
                                content: err,
                                key: 'lock',
                                duration: 5,
                            });
                            rejects('');
                        });
                });
            },
        });
    };
    const onChangeStatus = () =>
        Modal.confirm({
            title: `${
                status === 'Chưa cấp quyền'
                    ? 'Cấp Quyền User'
                    : 'Hủy Quyền User'
            }`,
            okText: `${
                status === 'Chưa cấp quyền' ? 'Cấp quyền' : 'Hủy quyền'
            }`,
            cancelText: 'Thoát',
            content: `Bạn có chắc chắn muốn ${
                status === 'Chưa cấp quyền'
                    ? 'cấp quyền cho tài khoản này?'
                    : 'hủy quyền tài khoản này?'
            }`,
            onOk: () => {
                message.loading({
                    content: 'Loading...',
                    key: 'status',
                    duration: 0,
                });
                return new Promise((resolve, rejects) => {
                    dispatch(
                        changeStatus({
                            status:
                                status === 'Chưa cấp quyền'
                                    ? 'Đã cấp quyền'
                                    : 'Chưa cấp quyền',
                            id: id,
                        })
                    )
                        .unwrap()
                        .then((res) => {
                            message.success({
                                content: res,
                                key: 'status',
                                duration: 5,
                            });
                            resolve('');
                        })
                        .catch((err) => {
                            message.error({
                                content: err,
                                key: 'status',
                                duration: 5,
                            });
                            rejects('');
                        });
                });
            },
        });
    const onAddCode = () => {
        const input = document.querySelector<HTMLInputElement>('.input');
        if (input && input.value && input.value !== '') {
            message.loading({
                content: 'Loading...',
                key: 'status',
                duration: 0,
            });
            dispatch(addCode({ content: input.value, id: id }))
                .unwrap()
                .then((res) => {
                    message.success({
                        content: res,
                        key: 'status',
                        duration: 5,
                    });
                    setVisible(false);
                })
                .catch((err) => {
                    message.error({
                        content: err,
                        key: 'status',
                        duration: 5,
                    });
                });
        } else {
            notification.error({
                description: 'Mã Được Nhập Không Hợp Lệ!!!',
                message: 'Xin hãy nhâp lại mã!',
            });
        }
    };
    const onDeleteUser = () => {
        Modal.confirm({
            title: 'Xóa User',
            okText: 'Xóa',
            cancelText: 'Thoát',
            content: 'Bạn có chắc chắn muốn xóa người dùng này?',
            onOk: () => {
                message.loading({
                    content: 'Loading...',
                    key: 'delete',
                    duration: 0,
                });
                return new Promise((resolve, rejects) => {
                    dispatch(deleteUser(id))
                        .unwrap()
                        .then((res) => {
                            message.success({
                                content: res,
                                key: 'delete',
                                duration: 5,
                            });
                            resolve('');
                        })
                        .catch((err) => {
                            message.error({
                                content: err,
                                key: 'status',
                                duration: 5,
                            });
                            rejects('');
                        });
                });
            },
        });
    };
    return (
        <div className="action">
            <button onClick={() => setVisible(true)} className="btn enable">
                <EditOutlined color="white"></EditOutlined>
            </button>
            <button
                onClick={onChangeLock}
                className={`btn ${lock === 'false' ? 'enable' : 'brow'}`}
            >
                {lock === 'false' ? <Unlock></Unlock> : <Lock></Lock>}
            </button>
            <button
                onClick={onChangeStatus}
                className={`btn ${
                    status === 'Đã cấp quyền' ? 'enable' : 'brow'
                }`}
            >
                {status === 'Đã cấp quyền' ? (
                    <Active></Active>
                ) : (
                    <Inactive></Inactive>
                )}
            </button>
            <button onClick={onDeleteUser} className="btn disable">
                <Trash></Trash>
            </button>
            <Modal
                visible={visible}
                title="Cập Nhập Mã"
                okText="Cập Nhập"
                cancelText="Thoát"
                onCancel={() => {
                    setVisible(false);
                }}
                onOk={() => onAddCode()}
            >
                <Input
                    size="large"
                    className="input"
                    placeholder="Mã..."
                ></Input>
            </Modal>
        </div>
    );
};
