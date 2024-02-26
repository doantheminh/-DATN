import { Drawer, Menu } from 'antd';
import { FunctionComponent, Key, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { RiDashboard3Fill } from "react-icons/ri";
import type { MenuProps } from 'antd';
import { MdOutlineProductionQuantityLimits, MdRateReview, MdSupervisorAccount } from 'react-icons/md';
import { LiaSalesforce } from "react-icons/lia";

type MenuItem = Required<MenuProps>['items'][number];
interface MobileModalProps {
    open: boolean;
    onClose: () => void;

}

function getItem(
    label: ReactNode,
    key: Key,
    icon?: ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}





const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const AdminMobileMenu: FunctionComponent<MobileModalProps> = ({ open, onClose }) => {

    const [openKeys, setOpenKeys] = useState(['sub1']);

    const items: MenuItem[] = [
        getItem(<Link onClick={onClose} to={'/admin'}>Bảng điều khiển</Link>, 'sub4', <RiDashboard3Fill />),
        getItem(<Link onClick={onClose} to={'/nhanvien/category'}>Quản lý danh mục</Link>, 'order', <BiSolidCategoryAlt />),
        getItem('Sản phẩm','sub5', <BiSolidCategoryAlt />, [
            getItem(<Link onClick={onClose} to={'/admin/product'}>Quản lý sản phẩm</Link>, 'product'),
            getItem(<Link onClick={onClose} to={'/admin/color'}>Quản lý màu sắc</Link>, 'color'),
            getItem(<Link onClick={onClose} to={'/admin/size'}>Quản lý kích thước</Link>, 'size'),
        ]),
        getItem(<Link onClick={onClose} to={'/admin/order'}>Đơn hàng</Link>, 'order', <MdOutlineProductionQuantityLimits />),
        getItem(<Link onClick={onClose} to={'/admin/order-review'}>Quán lý đánh giá</Link>, 'order-review', <MdRateReview />),
        getItem(<Link onClick={onClose} to={'/admin/sale'}>Quản lý mã giảm giá</Link>, 'sale', <LiaSalesforce />),
        getItem(<Link onClick={onClose} to={'/admin/user'}>Quản lý Tài khoản</Link>, 'account', <MdSupervisorAccount />),

    ];

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <Drawer title="Menu" placement="left" onClose={onClose} open={open}>
            <Menu className='w-full' mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} items={items} />
        </Drawer>
    );
};

export default AdminMobileMenu;
