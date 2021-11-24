import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { formData } from '../../type';
import { changePassword } from '../../redux/user/slice';
import { useAppDispatch } from '../../hooks';

function ModalChangePassword({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: any;
}) {
    const dispatch = useAppDispatch();
    const onChangePass = (user: FormData) => dispatch(changePassword(user));
    const [enable, setEnable] = useState<boolean>(true);
    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<formData>({
        defaultValues: {
            username: '',
            password: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: formData) => {
        const dataPost = new FormData();
        const modal = document.querySelector<HTMLElement>('.ant-modal-content');
        dataPost.append('username', data.username);
        dataPost.append('password', data.password);
        dataPost.append('newPassword', data.newPassword);
        if (data.newPassword !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: "confirmPassword is't correct",
            });
        } else {
            onChangePass(dataPost)
                .unwrap()
                .then((res) => {
                    if (modal) {
                        modal.style.pointerEvents = 'none';
                        setEnable(false);
                    }
                    message.loading({
                        content: 'Loading...',
                        key: 'success',
                        duration: 0,
                    });
                    setTimeout(() => {
                        if (res === 'Auth failed') {
                            message.error({
                                content: "Username or Password is't correct!!",
                                key: 'success',
                                duration: 5,
                            });
                            setEnable(true);
                        } else {
                            message.success({
                                content: 'Change Password successful!',
                                key: 'success',
                                duration: 5,
                            });
                            setVisible(false);
                        }
                        if (modal) {
                            modal.style.pointerEvents = 'auto';
                        }
                    }, 2000);
                })
                .catch((e) => {
                    message.error({ content: e, key: 'err', duration: 5 });
                });
        }
    };

    const Controller = ({ name, register, control, render, rules }: any) => {
        const value = useWatch({ control, name });
        const props = register(name, rules);
        return render({
            value,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                props.onChange({
                    target: {
                        name,
                        value: e.target.value,
                    },
                });
            },
            onBlur: props.onBlur,
            name: props.name,
        });
    };

    const InputElement = (props: any) => {
        const [value, setValue] = useState(props.value || '');
        useEffect(() => {
            setValue(props.value);
        }, [props.value]);
        return (
            <Input
                placeholder={props.name}
                name={props.name}
                size="large"
                type={props.type && props.type}
                onChange={(e) => {
                    setValue(e.target.value);
                    props.onChange(e);
                }}
                value={value}
            ></Input>
        );
    };

    const Error = ({ name }: any) => {
        return (
            <p className="error">
                <ErrorMessage
                    errors={errors}
                    name={name}
                    message={
                        errors.username?.message === ''
                            ? `This field is ${errors.username.type}`
                            : errors.username?.message
                    }
                />
            </p>
        );
    };

    const onCancel = (enable: boolean) => {
        if (enable) {
            return setVisible(false);
        } else {
            return () => {};
        }
    };

    return (
        <Modal
            title="CHANGE PASSWORD"
            visible={visible}
            onCancel={() => onCancel(enable)}
            centered
            className="non-border-top modal"
            footer={false}
        >
            <section className="wrap-change-pass" key={visible}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        {...{
                            control,
                            register,
                            name: 'username',
                            rules: { required: true },
                            render: (props: any) => (
                                <div>
                                    <InputElement {...props}></InputElement>
                                    <Error name="username"></Error>
                                </div>
                            ),
                        }}
                    />
                    <Controller
                        {...{
                            control,
                            register,
                            name: 'password',
                            rules: { required: true },
                            render: (props: any) => (
                                <div>
                                    <InputElement
                                        type="password"
                                        {...props}
                                    ></InputElement>
                                    <Error name="password"></Error>
                                </div>
                            ),
                        }}
                    />
                    <Controller
                        {...{
                            control,
                            register,
                            name: 'newPassword',
                            rules: { required: true },
                            render: (props: any) => (
                                <div>
                                    <InputElement
                                        type="password"
                                        {...props}
                                    ></InputElement>
                                    <Error name="newPassword"></Error>
                                </div>
                            ),
                        }}
                    />
                    <Controller
                        {...{
                            control,
                            register,
                            name: 'confirmPassword',
                            rules: { required: true },
                            render: (props: any) => (
                                <div>
                                    <InputElement
                                        type="password"
                                        {...props}
                                    ></InputElement>
                                    <Error name="confirmPassword"></Error>
                                </div>
                            ),
                        }}
                    />
                    <Button type="primary" danger htmlType="submit">
                        Change
                    </Button>
                </form>
            </section>
        </Modal>
    );
}

export default ModalChangePassword;
