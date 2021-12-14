import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import React from 'react';
import Highlighter from 'react-highlight-words';
import { DataTable } from '../../../type';
import { Action } from './action';

interface Props {
    scroll: number;
    dataSource: DataTable[];
}

export class TableContent extends React.Component<Props> {
    state = {
        searchText: '',
        searchedColumn: '',
    };

    searchInput: Input | null = null;

    getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: {
            setSelectedKeys: any;
            selectedKeys: any;
            confirm: any;
            clearFilters: any;
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        this.handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            this.handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            this.setState({
                                searchText: selectedKeys[0],
                                searchedColumn: dataIndex,
                            });
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
                setTimeout(() => this.searchInput?.select(), 100);
            }
        },
        render: (text: any) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = (clearFilters: any) => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const columns = [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',
                width: '6%',
            },
            {
                title: 'Số Điện Thoại',
                dataIndex: 'name',
                key: 'name',
                width: '15%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Tên Thành Viên',
                dataIndex: 'email',
                key: 'email',
                width: '20%',
                ...this.getColumnSearchProps('email'),
            },
            {
                title: 'Mã',
                dataIndex: 'code',
                key: 'code',
                width: '12%',
                ...this.getColumnSearchProps('code'),
            },
            {
                title: 'Trạng Thái',
                dataIndex: 'status',
                key: 'status',
                filters: [
                    { text: 'Đã Cấp Quyền', value: 'Đã' },
                    { text: 'Chưa Cấp Quyền', value: 'Chưa' },
                ],
                width: '15%',
                onFilter: (value: any, record: any) => {
                    return record.status.indexOf(value) === 0;
                },
                render: (text: string, record: any, index: any) => {
                    const status = record.status;
                    return (
                        <div className="status">
                            <span
                                className={`dot ${
                                    status === 'Đã cấp quyền' ? 'green' : 'red'
                                }`}
                            ></span>
                            <p>{status}</p>
                        </div>
                    );
                },
            },
            {
                title: 'Ngày Tạo',
                dataIndex: 'date',
                key: 'date',
                width: '10%',
                ...this.getColumnSearchProps('date'),
            },
            {
                title: '',
                dataIndex: 'action',
                key: 'action',
                width: '15%',
                render: (text: string, record: any, index: any) => {
                    const status = record.status;
                    const lock = record.lock;

                    return (
                        <Action
                            id={record.id}
                            status={status}
                            lock={lock}
                        ></Action>
                    );
                },
            },
        ];
        return (
            <Table
                className="table-detail"
                columns={columns}
                dataSource={this.props.dataSource}
                pagination={false}
                scroll={{ y: this.props.scroll }}
            />
        );
    }
}
