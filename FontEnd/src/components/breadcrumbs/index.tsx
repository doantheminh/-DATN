import { useMeQuery } from '@/services/auth';

import { FunctionComponent, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadCrumbProps {
    children:ReactNode
}

const BreadCrumb: FunctionComponent<BreadCrumbProps> = ({children}) => {
    const { data: authData, isLoading } = useMeQuery();
    if (isLoading) {
        return null;
    }
    const orderId = authData?._id || '';

    const location = useLocation(); 

    const routers = [
        {
            to: 'view_account',
            label: 'Thông tin cá nhân',
        },
        {
            to: `orders/${orderId}`,
            label: 'Đơn hàng đã đăt',
        },
        {
            to: 'favourite',
            label: 'Sản phẩm yêu thích',
        },
        {
            to: 'sale',
            label: 'Mã giảm giá',
        },
    ];

    return (
        <div>
            {/* <div className="bg-gray-100 text-sm p-4">
                <h1 className="font-semibold">Lời nhắc nhở thân thiện:</h1>
                <p>
                    Vui lòng không nhập địa chỉ PO Box/APO làm địa chỉ giao hàng theo yêu cầu của nhà cung cấp dịch vụ
                    hậu cần của chúng tôi.
                </p>
                <p>Đơn hàng không thể bị hủy sau khi đã thanh toán.</p>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-0 lg:gap-x-6 gap-y-4 mt-6 lg:grid-cols-4">
                <div className="lg:border-r border-gray-200 px-2 col-span-1">
                    <h1 className="px-2 text-xl border-gray-200 font-semibold border-b py-2">TÀI KHOẢN CỦA TÔI</h1>

                    <ul>
                        {routers.map((route, index) => (
                            <li key={index} className={`${
                                location.pathname === `/details/${route?.to}` ? '!bg-gray-200' : ''
                            } hover:bg-gray-100`}>
                                <Link className="block !text-black text-sm font-semibold px-2 py-2" to={route.to}>
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-3 lg:px-0 px-2">{children}</div>
            </div>
        </div>
    );
};

export default BreadCrumb;
