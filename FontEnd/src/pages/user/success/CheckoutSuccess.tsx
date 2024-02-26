import { useMeQuery } from '@/services/auth';
// import { useUpdateOrderStatusMutation } from '@/services/order';
import { clear } from '@/slices/cart';
import { useAppDispatch } from '@/store/hook';
import { Status } from '@/types/status';
// import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { FaCheckCircle } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import instance from '@/services/config';

const CheckoutSuccess = () => {
    const { id } = useParams();
    const [searchParams, _setSearchParams] = useSearchParams();
    const code = Number(searchParams.get('vnp_ResponseCode'));
    let successCode = Number('00');

    // router
    const router = useNavigate();
    const dispatch = useAppDispatch();
    // const { cartItems } = useAppSelector((state) => state.cart);
    const shouldLog = useRef(true);

    // const [update] = useUpdateOrderStatusMutation();
    const [timerCount, setTimer] = useState(5);
    const [disable, setDisable] = useState(true);
    const { data } = useMeQuery();

    const makeRequest = () => {
        if (code !== successCode) {
            return;
        } else {
            instance
                .patch(`order/confirm/${id}`, { status: Status.INFORMATION, isPaid: true })
                .then(() => {
                    dispatch(clear());
                })
                .then(() => {
                    setTimeout(() => {
                        router('/');
                    }, 5000);
                });
        }
    };

    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            makeRequest();
            // makeRequestInStock();
        }
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((lastTimerCount) => {
                lastTimerCount <= 1 && clearInterval(interval);
                if (lastTimerCount <= 1) setDisable(false);
                if (lastTimerCount <= 0) return lastTimerCount;
                return lastTimerCount - 1;
            });
        }, 1000); //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [disable]);

    return (
        <div className="bg-gray-100 h-screen flex items-center">
            <div className="bg-white p-6  max-w-3xl w-full rounded md:mx-auto">
                {code === successCode ? (
                    <div className="flex flex-col items-center gap-y-2">
                        <span>
                            <FaCheckCircle className="text-4xl text-green-500" />
                        </span>
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
                        <p className="text-gray-600 my-2">
                            Cảm ơn khách hàng
                            <span className="text-red-500 font-semibold text-lg">đã ủng hộ</span>
                        </p>
                        <p> Chúc bạn 1 ngày vui vẻ 🥰! </p>{' '}
                        <a href="/" className="!text-primary mt-2 block">
                            Trở lại
                        </a>
                        <div className="flex mt-4 flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            {disable && `Trở lại sau ${timerCount}s`}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-y-2">
                        <span>
                            <MdError className="text-4xl text-red-500" />
                        </span>
                        <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                            Thanh toán thất bại!
                        </h3>
                        <p className="text-gray-600 my-2">
                            Cảm ơn khách hàng
                            <span className="ml-2 text-red-500 font-semibold text-lg">
                                {data ? data?.username : ''} đã ủng hộ
                            </span>
                        </p>
                        <p> Chúc bạn 1 ngày vui vẻ 🥰! </p>{' '}
                        <a href="/" className="!text-primary mt-2 block">
                            Trở lại
                        </a>
                        <div className="flex mt-4 flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            {disable && `Trở lại sau ${timerCount}s`}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutSuccess;
