import React from 'react';
import { useAppSelector } from '../../../hooks';
import { TableContent } from './Table';

interface Props {
    scroll: number;
}

export const ListUser = ({ scroll }: Props) => {
    const dataSource = useAppSelector((state) => state.user.dataTableUser);
    return (
        <div className="table">
            <div className="table-header">
                <p className="title">Danh Sách Thành Viên</p>
            </div>
            <div className="table-contain">
                <TableContent
                    dataSource={dataSource}
                    scroll={scroll}
                ></TableContent>
            </div>
        </div>
    );
};
