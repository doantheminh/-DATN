import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetByIdSizeQuery, useUpdataSizeMutation } from '@/services/size';

const UpdateSize: React.FC<{ sizeId: string; handleUpdateComplete: () => void }> = ({
    sizeId,
  handleUpdateComplete,
}) => {
  const [form] = Form.useForm();
  const [mutate] = useUpdataSizeMutation();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: { name: string,active:boolean}) => {
    try {
      setIsLoading(true);
      await mutate({ sizeId, size: { name: values.name, active:values.active } }).unwrap();
      console.log(sizeId);
      
      handleUpdateComplete();
      toast.success('Cập nhật thành công');
    } catch (error) {
      console.error('Update size failed:', error);
      toast.error('Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const { data: size, isLoading: isSizeLoading } = useGetByIdSizeQuery(sizeId);

  useEffect(() => {
    if (size) {
      form.setFieldsValue({ name: size.name ,active:size.active});
    }
  }, [size]);

  const validateName = (_: any, value: string) => {
    const uppercaseValue = value.toUpperCase();
    if (value !== uppercaseValue) {
      return Promise.reject('Size phải viết hoa');
    }
    return Promise.resolve();
  };

  return (
    <>
      {isSizeLoading ? (
        <div>Loading...</div>
      ) : (
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
        >
          <Form.Item label="Tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên Size' },{ validator: validateName },]}>
            <Input />
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
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};

export default UpdateSize;