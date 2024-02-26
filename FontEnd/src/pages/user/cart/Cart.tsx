import CartComponent from '@/components/cart/CartComponent';
import Loading from '@/components/ui/Loading';
import { useAppSelector } from '@/store/hook';
import { formartVND } from '@/utils/formartVND';
import { reduceTotal } from '@/utils/reduce';
import { Alert } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
interface Discount {
    _id: number | string;
    code: string;
    discount: number;
    maxAmount: number;
    count: number;
    startDate: Date;
    endDate: Date;
}
interface CartProps {}
const Cart: FunctionComponent<CartProps> = () => {
    const { cartItems } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(false);
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [discountAmount, setDiscountAmount] = useState(0); // Thêm state cho số tiền giảm giá
    // Hàm xử lý thay đổi mã giảm giá từ input
    const handleDiscountCodeChange = (value: string) => {
        setDiscountCode(value);
    };
    // Hàm xử lý khi nhấn nút áp dụng mã giảm giá
    const applyDiscount = () => {
        if (discountCode.trim() === '') {
            alert('Vui lòng nhập mã giảm giá.');
            return;
        }

        const foundDiscount = discounts.find((discount) => discount.code === discountCode);

        if (foundDiscount) {
            const currentDate = new Date();

            if (currentDate >= new Date(foundDiscount.startDate) && currentDate <= new Date(foundDiscount.endDate)) {
                // Mã giảm giá hợp lệ, áp dụng giảm giá
                setAppliedDiscount(true);
                setDiscountAmount(foundDiscount.discount); // Cập nhật state discountAmount với số tiền giảm giá
                alert('Mã giảm giá đã được áp dụng!');
            } else {
                // Mã giảm giá hết hạn
                alert('Mã giảm giá đã hết hạn.');
            }
        } else {
            // Mã giảm giá không hợp lệ
            alert('Mã giảm giá không hợp lệ.');
        }
    };
    useEffect(() => {
        // Gửi yêu cầu API để lấy danh sách mã giảm giá từ locaso
        axios
            .get('http://localhost:8080/api/discounts')
            .then((response) => {
                // Lưu danh sách mã giảm giá vào state discounts
                setDiscounts(response.data.docs);
            })
            .catch((error) => {
                console.error('Error fetching discounts:', error);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [cartItems]);
    // Tính số tiền giảm giá từ phần trăm giảm trên tổng đơn hàng
    const totalCartPrice = reduceTotal(cartItems); // Tổng giá trị đơn hàng
    const discountAmountInMoney = (discountAmount / 100) * totalCartPrice;
    // Áp dụng số tiền giảm giá vào tổng giá trị đơn hàng
    const discountedPrice = totalCartPrice - discountAmountInMoney;
    return (
        <>
            {loading ? (
                <div className="min-h-screen">
                    <Loading />
                </div>
            ) : (
                <div className="max-w-full w-layout mx-auto">
                    <div className="grid lg:grid-cols-3 grid-cols-1 py-10 lg:px-0 lg:pr-2">
                        {!cartItems || cartItems?.length === 0 ? (
                            <div className="items-center flex-col w-full justify-center col-span-3 flex">
                                <div>
                                    <img src="/nahida.webp" className="w-layout max-w-full mx-auto" alt="" />
                                </div>
                                <div>
                                    <Alert
                                        message="Giỏ hàng của bạn đang trống"
                                        description="Rất vui khi quý khách mua hàng của chúng tôi"
                                        type="info"
                                        showIcon
                                    />
                                    <Link
                                        to={'/'}
                                        className="w-full block text-center py-4 px-2 uppercase !bg-primary hover:bg-secondary !text-white mt-2 font-semibold"
                                    >
                                        Quay lại trang chủ
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="col-span-2 p-4 text-nav">
                                    <CartComponent />

                                    {/* Apply Coupon */}
                                    <br />
                                    <div className="lg:flex md:flex space-y-4 lg:space-y-0 block flex-row-reverse justify-between items-center">
                                        <button className="bg-gray-200 opacity-80 hover:opacity-100 transition-all shadow text-sub px-3 py-2 uppercase">
                                            Cập nhật giỏ hàng
                                        </button>
                                        
                                    </div>
                                </div>
                                <div className="col-span-1 px-4 lg:px-0">
                                    <div className="border-2 border-gray-200 rounded space-y-6 p-5 font-semibold text-sm text-nav">
                                        <h1 className="uppercase text-xl">TỔNG GIỎ HÀNG</h1>

                                        <div className="flex flex-col justify-between gap-y-6">
                                            <div className="flex justify-between items-center border-b border-gray-200 py-3">
                                                <span>Tổng phụ</span>
                                                <span>{formartVND(reduceTotal(cartItems))}</span>
                                            </div>
                                            {/* hiển thị thổng số tiềng trong trang  */}
                                            <div className="flex justify-between items-center text-xl py-2">
                                                <p>Tổng</p>
                                                <p className="!text-primary">
                                                    {formartVND(reduceTotal(cartItems))}
                                                </p>
                                            </div>
                                            <a
                                                href="/checkout"
                                                className="block text-white text-center !bg-primary py-2"
                                            >
                                                TIẾN HÀNH KIỂM TRA
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
