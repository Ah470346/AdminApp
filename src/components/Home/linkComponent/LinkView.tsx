import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Input,
    message,
    Modal,
    notification,
    Select,
    Table,
} from 'antd';
import React, { useState } from 'react';
import { Socket } from 'socket.io-client';
import { ReactComponent as Trash } from '../../../assets/trash.svg';
import { useAppDispatch } from '../../../hooks';
import {
    addLink,
    changeLink,
    deleteLink,
} from '../../../redux/status_link/slice';
import { DataTableLink } from '../../../type';

interface Props {
    socket: Socket;
    dataSource: DataTableLink[];
    scroll: number;
}

interface DefaultValue {
    name: string;
    url: string;
}

const { Option } = Select;

const LinkView = ({ socket, dataSource, scroll }: Props) => {
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState('');
    const [inputName, setInputName] = useState<string | null>(null);
    const [inputRole, setInputRole] = useState<string | null>(null);
    const [inputUrl, setInputUrl] = useState<string | null>(null);
    const [idChange, setIdChange] = useState('');
    const [defaultValue, setDefaultValue] = useState<DefaultValue>();
    const onChangeLink = () => {
        if (
            (inputName !== '' && inputUrl !== '') ||
            (inputName === null && inputUrl == null)
        ) {
            message.loading({
                content: 'Loading...',
                key: 'change',
                duration: 0,
            });
            dispatch(
                changeLink({
                    link_name:
                        inputUrl !== null
                            ? inputUrl
                            : defaultValue
                            ? defaultValue.name
                            : '',
                    name:
                        inputName !== null
                            ? inputName
                            : defaultValue
                            ? defaultValue.name
                            : '',
                    id: idChange,
                })
            )
                .unwrap()
                .then((res: any) => {
                    message.success({
                        content: res.message,
                        key: 'change',
                        duration: 5,
                    });
                    setInputName(null);
                    setInputUrl(null);
                    setVisible(false);
                    setIdChange('');
                    setDefaultValue({ name: '', url: '' });
                })
                .catch((err) => {
                    message.error({
                        content: 'server is error',
                        key: 'change',
                        duration: 5,
                    });
                });
        } else {
            notification.error({
                description: 'Link Được Nhập Không Hợp Lệ!!!',
                message: 'Xin hãy nhâp lại Link!',
            });
        }
    };
    const onAddLink = () => {
        if (inputUrl && inputName && inputRole) {
            message.loading({
                content: 'Loading...',
                key: 'add',
                duration: 0,
            });
            dispatch(
                addLink({
                    link_name: inputUrl,
                    role: inputRole,
                    name: inputName,
                    id: '',
                })
            )
                .unwrap()
                .then((res: any) => {
                    message.success({
                        content: res.message,
                        key: 'add',
                        duration: 5,
                    });
                    setInputName(null);
                    setInputUrl(null);
                    setInputRole(null);
                    setVisible(false);
                })
                .catch((err) => {
                    message.error({
                        content: 'server is error',
                        key: 'add',
                        duration: 5,
                    });
                });
        } else {
            notification.error({
                description: 'Link Được Nhập Không Hợp Lệ!!!',
                message: 'Xin hãy nhâp lại Link!',
            });
        }
    };
    const onDeleteLink = (id: string, role: string) => {
        Modal.confirm({
            title: 'Xóa Link',
            okText: 'Xóa',
            cancelText: 'Thoát',
            content: 'Bạn có chắc chắn muốn xóa Link này?',
            onOk: () => {
                message.loading({
                    content: 'Loading...',
                    key: 'delete',
                    duration: 0,
                });
                return new Promise((resolve, rejects) => {
                    dispatch(deleteLink({ id: id, role: role, link_name: '' }))
                        .unwrap()
                        .then((res: any) => {
                            message.success({
                                content: res.message,
                                key: 'delete',
                                duration: 5,
                            });
                            resolve('');
                        })
                        .catch((err) => {
                            message.error({
                                content: err,
                                key: 'delete',
                                duration: 5,
                            });

                            resolve('');
                        });
                });
            },
        });
    };
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Vai Trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (text: string, record: any, index: any) => {
                return (
                    <div className="action">
                        <button
                            onClick={() => {
                                console.log('hehe');

                                setDefaultValue({
                                    name: record.name,
                                    url: record.url,
                                });
                                setVisible(true);
                                setAction('edit');
                                setIdChange(record.id);
                            }}
                            className="btn enable"
                        >
                            <EditOutlined color="white"></EditOutlined>
                        </button>
                        <button
                            onClick={() => onDeleteLink(record.id, record.role)}
                            className="btn disable"
                        >
                            <Trash></Trash>
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="wrap-link">
            <div className="table-header">
                <p className="title">Danh Sách Link</p>
                <Button
                    onClick={() => {
                        setVisible(true);
                        setAction('add');
                    }}
                    size="large"
                    type="primary"
                    icon={<PlusOutlined />}
                >
                    Thêm
                </Button>
            </div>
            <div className="table-contain">
                <Table
                    className="table-detail"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ y: scroll }}
                />
            </div>
            <Modal
                visible={visible}
                title={
                    action !== '' && action === 'edit'
                        ? 'Cập Nhập Link'
                        : 'Thêm link'
                }
                okText={
                    action !== '' && action === 'edit' ? 'Cập Nhập' : 'Thêm'
                }
                cancelText="Thoát"
                onCancel={() => {
                    setInputName(null);
                    setInputUrl(null);
                    setInputRole(null);
                    setIdChange('');
                    setVisible(false);
                }}
                onOk={() => {
                    if (action !== '' && action === 'edit') {
                        onChangeLink();
                    } else {
                        onAddLink();
                    }
                }}
            >
                <Input
                    key={Number(visible)}
                    size="large"
                    className="input link-name"
                    placeholder="Nhập Tên..."
                    style={{ marginBottom: 10 }}
                    onChange={(e) => setInputName(e.target.value)}
                    value={
                        inputName !== null
                            ? inputName
                            : action === 'edit' &&
                              defaultValue &&
                              defaultValue.name !== ''
                            ? defaultValue.name
                            : ''
                    }
                    defaultValue={'asasdasd'}
                ></Input>
                {action === 'add' && (
                    <Input
                        size="large"
                        className="input link-role"
                        placeholder="Nhập vai trò..."
                        style={{ marginBottom: 10 }}
                        onChange={(e) => setInputRole(e.target.value)}
                        value={inputRole ? inputRole : ''}
                    ></Input>
                )}
                <Input
                    size="large"
                    defaultValue={
                        action === 'edit' ? defaultValue?.url : undefined
                    }
                    className="input link-url"
                    placeholder="Nhập url..."
                    onChange={(e) => setInputUrl(e.target.value)}
                    value={
                        inputUrl !== null
                            ? inputUrl
                            : action === 'edit' &&
                              defaultValue &&
                              defaultValue.url !== ''
                            ? defaultValue.url
                            : ''
                    }
                ></Input>
            </Modal>
        </div>
    );
};

export default LinkView;
