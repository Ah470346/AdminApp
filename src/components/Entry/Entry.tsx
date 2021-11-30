import React, {
    useEffect,
    useState,
    useLayoutEffect,
    KeyboardEvent,
} from 'react';
import { message, notification } from 'antd';
import { Input, Button } from 'antd';
import { getEntry, postEntry, returnImage } from '../../redux/entry/slice';
import { setPersist } from '../../redux/persistLogin/slice';
import { useAppDispatch } from '../../hooks';
import { refresh } from '../../type';
import Cookies from 'universal-cookie';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Modal } from 'antd';

const { TextArea } = Input;

interface entry {
    field_name: string;
    data_image: string;
    imageId: number;
    fieldId: number;
    tableform: string;
}

function Entry(props: any) {
    const cookie = new Cookies();
    const dispatch = useAppDispatch();
    const getEntryInfo = (token: string) => dispatch(getEntry(token));
    const postEntryInfo = (data: FormData, token: string) =>
        dispatch(postEntry({ data, token }));
    const returnImageInfo = (data: FormData) => dispatch(returnImage(data));
    const onPersist = (persist: boolean) => dispatch(setPersist(persist));
    const [empty, setEmpty] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);

    const [entry, setEntry] = useState<entry>({
        field_name: '',
        data_image: '',
        imageId: 0,
        fieldId: 0,
        tableform: '',
    });
    const onSubmit = (submitEmpty?: boolean) => {
        const text = document.querySelector<HTMLInputElement>('.text');
        if (empty === true) {
            notification.error({
                message: 'Error',
                description: "Don't submit when batch is empty!",
                duration: 5,
            });
        } else if (
            text?.value.split('+').length !==
                entry.field_name.slice(entry.field_name.indexOf('(')).split('+')
                    .length &&
            submitEmpty !== true &&
            text?.value !== ''
        ) {
            notification.error({
                message: 'Error',
                description:
                    'Plus character Input must equals plus character Name!',
                duration: 5,
            });
        } else if (text) {
            const formDataEntry = new FormData();
            const date = new Date();
            formDataEntry.append('imageId', entry.imageId.toString());
            formDataEntry.append('tableform', entry.tableform);
            formDataEntry.append('fieldId', entry.fieldId.toString());
            formDataEntry.append(
                'timeEnter',
                (date.getTime() - time).toString()
            );
            formDataEntry.append('content', text.value);
            postEntryInfo(formDataEntry, cookie.get('token'))
                .unwrap()
                .then((res: any) => {
                    message.success({
                        content: `Submit ${res.message}!`,
                        key: 'success',
                        duration: 5,
                    });
                    refreshImage();
                })
                .catch((err) => {
                    refreshImage();
                    message.error({ content: err, key: 'err', duration: 5 });
                });
        }
    };

    const onSubmitEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        const text = document.querySelector<HTMLInputElement>('.text');

        if (e.key === 'Enter') {
            e.preventDefault();
            if (text && text.value === '') {
                if (empty === true) {
                    notification.error({
                        message: 'Error',
                        description: "Don't submit when batch is empty!",
                        duration: 5,
                    });
                } else {
                    setShow(true);
                }
            } else {
                onSubmit();
            }
        }
    };
    const return_image = () => {
        const formReturnImage = new FormData();
        formReturnImage.append('imageId', entry.imageId.toString());
        formReturnImage.append('tableform', entry.tableform);

        returnImageInfo(formReturnImage)
            .unwrap()
            .then((res: any) => {
                console.log(res.message);
            });
    };
    const refreshImage = () => {
        getEntryInfo(cookie.get('token'))
            .unwrap()
            .then((res: any) => {
                if (res.message === 'Batch Empty') {
                    console.log(res.message);

                    setEmpty(true);
                    message.warning({
                        content: 'The batch is out',
                        key: 'warning',
                        duration: 5,
                    });
                } else {
                    setEmpty(false);
                    const date = new Date();
                    setTime(date.getTime());
                    setEntry(res);
                }
            })
            .catch((err) => {
                // setEmpty(true);
                message.error({ content: err, key: 'err', duration: 5 });
                if (err === 'Server is disconnected!') {
                    refresh(false);
                    onPersist(false);
                }
            });
    };
    useEffect(() => {
        const info = document.querySelector<HTMLElement>('.wrap-entry');
        if (info !== null) {
            info.style.height = `${window.innerHeight - 65}px`;
        }
        refreshImage();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const text = document.querySelector<HTMLInputElement>('.text');
        if (text) {
            text.value = '';
        }
    });

    useLayoutEffect(() => {
        if (entry.imageId !== 0) {
            window.onbeforeunload = () => {
                return_image();
            };
        }
    }, [entry]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="wrap-entry">
            <div className="entry">
                <div className="wrap-image">
                    {entry?.data_image && empty === false ? (
                        <TransformWrapper
                            initialScale={1}
                            minScale={0.3}
                            maxScale={2}
                            centerOnInit={true}
                            centerZoomedOut={false}
                        >
                            {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                <React.Fragment>
                                    <div className="tools">
                                        <button onClick={() => zoomIn()}>
                                            +
                                        </button>
                                        <button onClick={() => zoomOut()}>
                                            -
                                        </button>
                                        <button
                                            onClick={() => resetTransform()}
                                        >
                                            x
                                        </button>
                                    </div>
                                    <TransformComponent>
                                        <img
                                            className="image"
                                            src={`data:image/png;base64,${entry.data_image}`}
                                            alt="#"
                                        />
                                        )
                                    </TransformComponent>
                                </React.Fragment>
                            )}
                        </TransformWrapper>
                    ) : (
                        <p className="empty" style={{ fontSize: '1.4em' }}>
                            Empty
                        </p>
                    )}
                </div>
                <div className="wrap-input">
                    <div className="title">
                        <p>
                            Name:{' '}
                            {empty !== true && entry.field_name ? (
                                <span className="name">
                                    {entry?.field_name}
                                </span>
                            ) : (
                                <span className="empty">Empty</span>
                            )}
                        </p>
                    </div>
                    <TextArea
                        className="text"
                        autoSize={true}
                        placeholder="Enter text..."
                        onKeyPress={(e) => onSubmitEnter(e)}
                    ></TextArea>
                    <div className="submit">
                        <Button onClick={() => onSubmit()} type="primary">
                            SUBMIT
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                title="Confirm"
                visible={show}
                className="modal-empty"
                onCancel={() => setShow(false)}
                onOk={() => {
                    onSubmit(true);
                    setShow(false);
                }}
                centered
            >
                Do you want submit when textbox is empty?
            </Modal>
        </div>
    );
}

export default Entry;
