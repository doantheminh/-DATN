import React, { useState, useEffect } from 'react';
import { Button, Carousel, Form, Input, Rate, Spin, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAddOrderCommentMutation } from '@/services/ordercomments';
import { useMeQuery } from '@/services/auth';
import { useGetOrderByIdQuery } from '@/services/order'; // Import the query to get order details
import UploadFileServer from '@/components/uploads/up';
import UploadVideoServer from '@/components/uploads/video';
import { BsCheckCircleFill } from 'react-icons/bs';
import { MdSmsFailed } from 'react-icons/md';
import { formartVND } from '@/utils/formartVND';
import { Status } from '@/types/status';

const OrderBinhluan: React.FC<{ orderId: string; handleUpdateProduct: () => void }> = ({
    orderId,

}) => {
    const [addComment, { data: commentData, isLoading }] = useAddOrderCommentMutation();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState();
    const router = useNavigate();
    const { data: authData } = useMeQuery();
    const { data: orderData } = useGetOrderByIdQuery(orderId);
    const [images, setImages] = useState<string[]>([]);
    const [videos, setVideos] = useState<string[]>([]);
    const [ratingValue] = useState();

    const [feedback, setFeedback] = useState(() => {
        const storedFeedback = localStorage.getItem('feedback');
        return storedFeedback !== null ? storedFeedback : '';
    });

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleRatingChange = (value: any) => {
        setRating(value);
        // switch (value) {
        //     case 1:
        //         setFeedback('Tệ');
        //         break;
        //     case 2:
        //         setFeedback('Không hài lòng');
        //         break;
        //     case 3:
        //         setFeedback('Bình thường');
        //         break;
        //     case 4:
        //         setFeedback('Hài lòng');
        //         break;
        //     case 5:
        //         setFeedback('Tuyệt vời');
        //         break;
        //     default:
        //         setFeedback('');
        // }
    };

    const handleSubmit = async () => {
        if (comment.trim() === '') {
            console.error('Comment text is required');
            return;
        }
        if (!authData) {
            return router('/account/signin');
        }

        try {
            const productIds = orderData?.products?.map((product) => product._id) || [];

            await addComment({
                text: comment,
                rating: rating,
                userId: authData?._id,
                orderId: orderId,
                productId: productIds,
                images: images,
                videos: videos,
                status: 5,
            });

            setComment('');
            alert('Bình luận của bạn đã được gửi thành công.');
            window.location.reload();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    useEffect(() => {
        if (commentData) {
            notification.success({
                message: 'Thành công',
                description: 'Bình luận của bạn đã được gửi thành công.',
            });
            setComment('');

        }
    }, [commentData]);

    return (


        <div className='bg-gray-100 py-2'>
            {orderData ? (

                <div className="">
                    <div className="max-w-5xl mx-auto bg-white py-4 mt-2">
                        <div className="px-4 py-2">
                            <div className="text-xl">Đánh Giá Sản phẩm  </div>
                            <div className='mt-4 '>
                                <div className="">
                                    <div className="">
                                        {orderData.products.map((product, index) => (
                                            <div key={index} className='mt-4'>
                                                <Carousel >
                                                    {product.images.map((image, imgIndex) => (
                                                        <div key={imgIndex}>
                                                            <div className="flex">

                                                                <Form.Item  >
                                                                    <div className="w-32">
                                                                        <img src={image} alt={`Product ${index + 1}`} className="w-full" />

                                                                    </div>
                                                                </Form.Item>


                                                                <div className="px-3">
                                                                    <div className="ml-2">{product.name}</div>
                                                                    <div className="flex items-center">
                                                                        <span className={`ml-2 ${orderData.status === Status.COMPLETE ? 'text-green-500' : 'text-red-500'}`}>
                                                                            {orderData.status === Status.COMPLETE ? 'Đã giao' : 'Đã hủy'}
                                                                        </span>
                                                                        <span className="ml-2">
                                                                            {orderData.status === Status.COMPLETE ? <BsCheckCircleFill /> : <MdSmsFailed />}
                                                                        </span>
                                                                    </div>

                                                                    <div className="ml-2">
                                                                        x{product?.quantity}
                                                                    </div>
                                                                    <div className="ml-2">
                                                                        {product.price}

                                                                    </div>
                                                                    <td className="product-total  ml-2">Tổng :{formartVND(product.price * product.quantity)}</td>
                                                                </div>

                                                            </div>
                                                            <Spin spinning={isLoading}>
                                                                <div className="max-w-5xl mx-auto bg-white  py-4 mt-3">
                                                                    <div className="px-4 py-2">
                                                                        <div className="text-xl">Đánh giá </div>
                                                                        <div className="container mx-auto py-8">
                                                                            <div className="flex">
                                                                                <div className="w-1/2 pl-6 border-l">
                                                                                    <Form name="review_form" initialValues={{ rating: rating }}>
                                                                                        <Form.Item
                                                                                            name="rating"
                                                                                            label="Chất lượng sản phẩm"
                                                                                            rules={[{ required: true, message: 'Vui lòng đánh giá sản phẩm!' }]}
                                                                                        >
                                                                                            <div className="flex">
                                                                                                <Rate allowHalf value={ratingValue} onChange={handleRatingChange} />
                                                                                                <p className="px-1 text-amber-400">{feedback}</p>
                                                                                            </div>
                                                                                        </Form.Item>
                                                                                        <Form.Item
                                                                                            name="text"
                                                                                            label="Đánh giá chi tiết"
                                                                                            rules={[{ required: true, message: 'Vui lòng nhập đánh giá chi tiết!' }]}
                                                                                        >
                                                                                            <Input.TextArea rows={4} placeholder="Để lại đánh giá" onChange={handleCommentChange} />
                                                                                        </Form.Item>
                                                                                        <Form.Item label="Thêm ảnh" >
                                                                                            <UploadFileServer setImages={setImages} />
                                                                                        </Form.Item>
                                                                                        <Form.Item label="Thêm video" >
                                                                                            <UploadVideoServer setVideos={setVideos} />
                                                                                        </Form.Item>

                                                                                    </Form>

                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Spin>

                                                        </div>
                                                    ))}
                                                </Carousel>

                                            </div>
                                        ))}
                                    </div>

                                </div>

                            </div>
                            <Form.Item>
                                <Button  onClick={handleSubmit} loading={isLoading}>
                                    {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </Button>
                            </Form.Item>

                        </div>
                    </div>





                </div>
            ) : (
                <div>Không tìm thấy thông tin đơn hàng</div>
            )}
        </div>



    );
};

export default OrderBinhluan;
