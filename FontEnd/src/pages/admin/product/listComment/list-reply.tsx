import { useMeQuery } from '@/services/auth';
import { useGetByIdOrderCommentsQuery } from '@/services/ordercomments';
import { Button, Image, Rate } from 'antd';
import React, { useState, useEffect } from 'react';
import Ashirt from "../../../../../public/Ashirt.png"
import './comment.css';

const ListReply: React.FC<{ productId: string }> = ({
    productId,
}) => {

    const { data: currentProduct } = useGetByIdOrderCommentsQuery(productId);
    const { data: authData } = useMeQuery();
    const [showAllReplies, setShowAllReplies] = useState(false);

    const handleToggleReplies = () => {
        setShowAllReplies(!showAllReplies);
    };



    return (
        <>
            <article
                key={currentProduct?._id}
                className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
            >
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">


                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <time title="February 8th, 2022">
                                {/* {formatTimeToNow(new Date(item?.createdAt))} */}
                            </time>
                        </p>

                    </div>
                    {!authData || authData?._id !== currentProduct?.userId?._id ? undefined : (


                        <div
                            id={`dropdownComment_${currentProduct?._id}`}
                            data-dropdown-toggle={`dropdownComment_${currentProduct?._id}`}
                            className="relative inline-block"
                        >
                            <button
                                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                type="button"

                            >
                                <svg
                                    className={`w-4 h-4  transition-all`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 3"
                                >
                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                </svg>
                                <span className="sr-only">Comment settings</span>
                            </button>
                            {openAbsolute[currentProduct?._id || ''] && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 text-center rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div
                                        className="py-1"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby={`dropdownComment_${currentProduct?._id}_button`}
                                    >





                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </footer>
                <div className="p-3">
                    <Rate disabled allowHalf value={currentProduct?.rating} character={<span style={{ fontSize: '20px' }}>★</span>} />
                </div>
                <div className='flex p-3'>
                    <p className="text-gray-800 dark:text-white text-sm py-2" style={{ opacity: 0.6 }}>Mô tả sản phẩm:


                    </p>
                    <a className='px-1 py-1'> {currentProduct?.text}</a>
                </div>
                <div className="flex">
                    <div>

                        {currentProduct?.videos.map((video, index) => (
                            <div key={index} className="py-1">
                                <video width={220} height={200} controls>
                                    <source src={video} type="video/mp4" />

                                </video>
                            </div>
                        ))}
                    </div>
                    <div className="py-1 px-2">
                        {currentProduct?.images.map((image, index) => (
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
                    {currentProduct?.replies.slice(0, showAllReplies ? currentProduct?.replies.length : 2).map((reply, index) => (
                        <div key={index} className="flex justify-start ml-10">
                            <div className="container darker p-2 w-[350px]">
                                <img src={Ashirt} className="w-[28px] h-[30px] left" alt="" />
                                <p>{reply?.text}</p>
                            </div>
                        </div>
                    ))}

                    {currentProduct?.replies.length > 2 && (
                        <div className="flex justify-start ml-10">
                            <Button
                                onClick={handleToggleReplies}
                                className="link-button"
                                style={{ background: 'none', border: 'none', padding: 0, color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                            >
                                {showAllReplies ? 'Thu gọn' : 'Xem thêm'}
                            </Button>

                        </div>
                    )}
                </div>
            </article>
        </>
    );
};

export default ListReply;
