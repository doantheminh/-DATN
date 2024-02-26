import { Status } from "@/types/status";

export const renderStatus = (status: number) => {
    if (status === Status.INFORMATION) {
        return <span className="border px-2 py-1 bg-gray-300 text-black">Chờ xác nhận</span>;
    }

    if (status === Status.ORDER_CONFIRM) {
        return <span className="border px-2 py-1 bg-green-700 text-white">Đã xác nhận</span>;
    }

    if (status === Status.SHIPPING) {
        return <span className="border px-2 py-1 !bg-primary text-white">Giao hàng</span>;
    }

    if (status === Status.COMPLETE) {
        return <span className="border px-2 py-1 bg-green-500 text-white">Hoàn thành</span>;
    }

    if (status === Status.CANCELLED) {
        return <span className="border px-2 py-1 bg-red-700 text-white">Đã hủy</span>;
    }
};