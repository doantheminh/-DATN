import { Button, Image, Modal, Popconfirm, Rate, Spin } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';
import UpdateComment from '../updateComment/UpdateComment';
import { useMeQuery } from '@/services/auth';
import { formatTimeToNow } from '@/utils/formartDate';
import { OrderComment, useGetAllOrderCommentsQuery, useRemoveOrderCommentMutation } from '@/services/ordercomments';
import './comment.css';
import Ashirt from '../../../../public/Ashirt.png';

const Comment = ({ userId, productId = [], orderId }: OrderComment) => {
    const [removeId] = useRemoveOrderCommentMutation();
    const { data: orderCommentsData } = useGetAllOrderCommentsQuery({
        startDate: '',
        endDate: '',
    });
    console.log('comment', orderCommentsData);

    const [loading] = useState(false);
    const [openAbsolute, setOpenAbsolute] = useState<{ [key: string]: boolean }>({});
    const { data: authData } = useMeQuery();

    const [selectedProduct, setSelectedProduct] = useState('');
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const handleUpdateComplete = (commentId: string) => {
        setSelectedProduct(commentId);
        setOpenUpdateModal(true);
    };

    const handleUpdateC = () => {
        setSelectedProduct('');
        setOpenUpdateModal(false);
    };

    const handleDeleteOrderComment = async (id: string) => {
        try {
            await removeId(id);
            toast.success('Xóa thành công');
        } catch (error) {
            toast.error('Xóa không thành công');
        }
    };
    const [showAllReplies, setShowAllReplies] = useState(false);

    const handleToggleReplies = () => {
        setShowAllReplies(!showAllReplies);
    };
    return (
        <>
            <Spin spinning={loading}>
                <section className="bg-white dark:bg-gray-900 py-8 antialiased">
                    <div className="max-w-4xl mx-auto px-4">
                        <div>
                            <div className="list-group-item">
                                <div className="d-inline-block font-weight-medium text-uppercase">
                                    Đánh giá sản phẩm
                                </div>
                            </div>
                            {Array.isArray(orderCommentsData) && orderCommentsData
                                ?.filter((ordercomment) =>
                                    ordercomment.productId?.some((id) => productId.includes(id)),
                                )
                                ?.map((item) => (
                                    <article
                                        key={item?._id}
                                        className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
                                    >
                                        <footer className="flex justify-between items-center mb-2">
                                            <div className="flex items-center">
                                                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                    <img
                                                        className="mr-2 w-6 h-6 rounded-full"
                                                        src={authData?.avatar}
                                                        alt="Michael Gough"
                                                    />
                                                    {item?.userId?.username}
                                                </p>

                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <time title="February 8th, 2022">
                                                        {formatTimeToNow(new Date(item?.createdAt))}
                                                    </time>
                                                </p>
                                            </div>
                                            {!authData || authData?._id !== item.userId?._id ? undefined : (
                                                <div
                                                    id={`dropdownComment_${item?._id}`}
                                                    data-dropdown-toggle={`dropdownComment_${item?._id}`}
                                                    className="relative inline-block"
                                                >
                                                    <button
                                                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                        type="button"
                                                        onClick={() =>
                                                            setOpenAbsolute((prevState) => ({
                                                                ...prevState,
                                                                [item?._id || '']: !prevState[item?._id || ''],
                                                            }))
                                                        }
                                                    >
                                                        <svg
                                                            className={`w-4 h-4 ${openAbsolute ? 'rotate-180' : ''
                                                                } transition-all`}
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 16 3"
                                                        >
                                                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                                        </svg>
                                                        <span className="sr-only">Comment settings</span>
                                                    </button>
                                                    {openAbsolute[item?._id || ''] && (
                                                        <div className="origin-top-right absolute right-0 mt-2 w-48 text-center rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                                            <div
                                                                className="py-1"
                                                                role="menu"
                                                                aria-orientation="vertical"
                                                                aria-labelledby={`dropdownComment_${item?._id}_button`}
                                                            >
                                                                <a
                                                                    className=" block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white "
                                                                    type="dashed"
                                                                    onClick={() => handleUpdateComplete(item?._id!)}
                                                                >
                                                                    Sửa
                                                                </a>
                                                                <Popconfirm
                                                                    placement="topRight"
                                                                    title="Bạn Muốn Xóa ?"
                                                                    okText="OK"
                                                                    cancelText="Cancel"
                                                                    okButtonProps={{
                                                                        style: {
                                                                            backgroundColor: 'red',
                                                                            color: 'white',
                                                                        },
                                                                    }}
                                                                    onConfirm={() =>
                                                                        handleDeleteOrderComment(item?._id!)
                                                                    }
                                                                >
                                                                    <a className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        Xóa
                                                                    </a>
                                                                </Popconfirm>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </footer>
                                        <div>
                                            <Rate
                                                disabled
                                                allowHalf
                                                value={item.rating}
                                                character={<span style={{ fontSize: '20px' }}>★</span>}
                                            />
                                        </div>
                                        <div className="flex">
                                            <p
                                                className="text-gray-800 dark:text-white text-sm py-2"
                                                style={{ opacity: 0.6 }}
                                            >
                                                Mô tả sản phẩm:
                                            </p>
                                            <a className="px-1 py-1"> {item.text}</a>
                                        </div>
                                        <div className="flex">
                                            <div>
                                                {item.videos.map((video, index) => (
                                                    <div key={index} className="py-1">
                                                        <video width={220} height={200} controls>
                                                            <source src={video} type="video/mp4" />
                                                        </video>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="py-1 px-2">
                                                {item.images.map((image, index) => (
                                                    <Image
                                                        key={index}
                                                        src={image}
                                                        alt={`image_${index}`}
                                                        width={150}
                                                        height={170}
                                                        className="p-1"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            {item.replies
                                                .slice(0, showAllReplies ? item.replies.length : 2)
                                                .map((reply, index) => (
                                                    <div key={index} className="flex justify-start">
                                                        <div className="container darker p-2 w-[350px]">
                                                            <img
                                                                src={Ashirt}
                                                                className="w-[28px] h-[30px] left"
                                                                alt=""
                                                            />
                                                            <p>{reply?.text}</p>
                                                        </div>
                                                    </div>
                                                ))}

                                            {item.replies.length > 2 && (
                                                <div className="flex justify-start ml-10">
                                                    <Button
                                                        onClick={handleToggleReplies}
                                                        className="link-button"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            padding: 0,
                                                            color: 'blue',
                                                            textDecoration: 'underline',
                                                            cursor: 'pointer',
                                                            marginLeft: '10px',
                                                        }}
                                                    >
                                                        {showAllReplies ? 'Thu gọn' : 'Xem thêm'}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))}
                        </div>
                    </div>
                </section>
            </Spin>

            <Modal
                title="Cập nhật sản phẩm"
                open={openUpdateModal}
                onCancel={handleUpdateC}
                footer={null}
                destroyOnClose={true}
                width={900}
                style={{ maxWidth: 900 }}
                centered
            >
                {selectedProduct && (
                    <UpdateComment
                        commentId={selectedProduct}
                        userId={userId}
                        productId={productId}
                        orderId={orderId}
                        handleUpdateComplete={handleUpdateC}
                    />
                )}
            </Modal>
        </>
    );
};
export default Comment;
