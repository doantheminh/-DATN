import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Rate } from 'antd';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetByIdOrderCommentsQuery, useUpdateOrderCommentMutation } from '@/services/ordercomments';
import UploadFileServer from '@/components/uploads/up';
import UploadVideoServer from '@/components/uploads/video';


const UpdateComment: React.FC<{ userId: string, productId: any, orderId: string, commentId: string; handleUpdateComplete: () => void }> = ({
    commentId,
    productId,
    userId,
    orderId,
    handleUpdateComplete,
}) => {
    const [form] = Form.useForm();
    const [mutate] = useUpdateOrderCommentMutation();
    const [isLoading, setIsLoading] = useState(false);
    const { data: comment, isLoading: isCategoryLoading } = useGetByIdOrderCommentsQuery(commentId);
    const [images, setImages] = useState<string[]>(comment?.images!);
    const [videos, setVideos] = useState<string[]>(comment?.videos!);
    const onFinish = async (values: any) => {
        try {
            setIsLoading(true);

            await mutate
                ({
                    productId,
                    userId,
                    orderId,
                    commentId,
                    ordercomments: {
                        ...comment,
                        ...values,
                        images,
                        videos

                    },
                }).unwrap();
            handleUpdateComplete();
            toast.success('Cập nhật thành công');
        } catch (error) {
            console.error('Update bình luận failed:', error);
            toast.error('Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };


   



    useEffect(() => {
        if (!isCategoryLoading && comment) {
            form.setFieldsValue({
                text: comment.text,
                rating: comment.rating,
            });
            setImages(comment?.images!)
            setVideos(comment?.videos!)
        }
        
    }, [comment, isCategoryLoading, form]);

    return (
        <>
            {isCategoryLoading ? (
                <div>Loading...</div>
            ) : (
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Form.Item label="bình luận" name="text" rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Đánh giá" name="rating">
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item label="Thêm ảnh">
                        <UploadFileServer images={images!} setImages={setImages} />
                    </Form.Item>
                    <Form.Item label="Thêm video" >
                                        <UploadVideoServer videos={videos!} setVideos={setVideos} />
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

export default UpdateComment;