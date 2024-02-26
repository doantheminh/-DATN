import { useMeQuery } from '@/services/auth';
import instance from '@/services/config';
import { useGetUserByIdQuery } from '@/services/user';
import { Button, Form, Input, Spin, message } from 'antd';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

type FieldType = {
    username?: string;
    password?: string;
    role?: string;
    phone?: number;
    email?: string;
    address?: string;
};

interface Props {
    setOpenAddModal: Dispatch<SetStateAction<boolean>>;
}

const UpdateAccount: FC<Props> = ({ setOpenAddModal }) => {
    const { data: authData } = useMeQuery();
    const [form] = Form.useForm();

    const id: string | undefined = authData?._id as string | undefined;

    const { data: userData, isLoading } = useGetUserByIdQuery(id as string);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            username: authData?.username,
            email: authData?.email,
            password: '',
        });
    }, [form]);

    const onFinish = (values: any) => {
        const { email, password } = values;

        setLoading(true);
        instance
            .post('change-password', {
                email,
                password,
            })
            .then((res) => message.info(res.data.message))
            .then(() => setOpenAddModal(false))
            .catch((err) => message.error(err.message))
            .finally(() => setLoading(false));
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            {isLoading && !userData ? (
                <Spin />
            ) : (
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your Email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType> label="Mật khẩu mới" name={'password'}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button loading={loading} htmlType="submit" type="default" className="ml-2">
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default UpdateAccount;
