import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateColorMutation } from '@/services/color';

interface AddColorProps {
  handleModalClose: () => void;
}

const AddColor: React.FC<AddColorProps> = ({ handleModalClose }) => {
  const [form] = Form.useForm();
  const [mutateCreateColor] = useCreateColorMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      await mutateCreateColor(values).unwrap();

      form.resetFields();
      toast.success('Tạo màu thành công');
      handleModalClose();
    } catch (error) {
      toast.error('Tạo màu không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const validateName = (_: any, value: string) => {
    const firstCharacter = value.charAt(0);
    if (!/^[A-ZĐ]/.test(firstCharacter)) {
      return Promise.reject('Tên phải bắt đầu bằng chữ cái viết hoa');
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên màu' },
            { min: 2, message: 'Ít nhất 2 ký tự' },
            { validator: validateName },
          ]}
        >
          <Input placeholder="Tên màu" />
        </Form.Item>

        <Form.Item
          label="Hoạt động"
          name="active"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái hoạt động' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value={true}>Hoạt động</Select.Option>
            <Select.Option value={false}>Không hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" className='bg-primary' htmlType="submit" loading={isLoading}>
            Tạo màu
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddColor;