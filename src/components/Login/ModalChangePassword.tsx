import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Input, Button } from 'antd';
import { useForm, useWatch } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { FormData } from '../../type';

function ModalChangePassword({
    visible,
    setVisible,
}: {
    visible: boolean;
    setVisible: any;
}) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            username: '',
            password: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: FormData) => {
        console.log(data);
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
            console.log(props.value);
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

    return (
        <Modal
            title="CHANGE PASSWORD"
            visible={visible}
            onCancel={() => setVisible(false)}
            centered
            footer={false}
        >
            <section className="wrap-change-pass">
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
