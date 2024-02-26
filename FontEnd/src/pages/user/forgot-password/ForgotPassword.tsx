import instance from '@/services/config';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import styled from 'styled-components';

const StyleInput = styled(Input)`
    border-radius: 2px;
    padding: 10px 12px;

    &:focus-within {
        border-color: #333;
    }

    &:hover {
        border-color: #333;
    }
`;

const StyleButton = styled(Button)`
    background-color: #ca6f04;
    padding: 12px 0;
    height: auto;
    text-align: center;
    color: #fff !important;
    width: 100%;
    border-radius: 2px;
    border-color: #ca6f04 !important;
    font-size: 16px;

    &:hover {
        opacity: 0.9;
    }
`;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);

    const onSubmit = (values: any) => {
        setLoading(true);
        instance
            .post('forgot-password', { ...values })
            .then((res) => message.warning(res.data.message))
            .catch(() => message.error('Email không tồn tại'))
            .finally(() => setLoading(false));
    };

    return (
        <div className="max-w-4xl mx-auto mt-24">
            <div className="max-w-4xl mx-auto mt-24">
                <div className="flex flex-col items-center justify-center  p-4 space-y-4 antialiased text-gray-900">
                    <div className="w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16">
                        <h1 className=" mb-6 text-3xl font-bold text-center">Đừng lo</h1>
                        <p className="text-center mx-12">
                            Chúng tôi ở đây để giúp bạn khôi phục mật khẩu của mình. Nhập địa chỉ email bạn đã sử dụng
                            khi tham gia và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
                        </p>
                        <Form layout="vertical" onFinish={onSubmit}>
                            <Form.Item
                                name={'email'}
                                label={'Địa chỉ email'}
                                rules={[{ required: true, message: 'Bắt buộc' }]}
                            >
                                <StyleInput />
                            </Form.Item>

                            <StyleButton loading={loading} htmlType="submit">
                                Gửi
                            </StyleButton>
                        </Form>
                        <div className="text-sm text-gray-600 items-center flex justify-between">
                            <a
                                href="/"
                                className="text-gray-800 gap-x-2 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4"
                            >
                                <BsArrowLeft />
                                <span> Trở lại</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
