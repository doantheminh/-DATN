import { Drawer, Menu } from 'antd';
import { FunctionComponent, Key, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import type { MenuProps } from 'antd';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { LiaSalesforce } from 'react-icons/lia';

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

const EditorMobileMenu: FunctionComponent<MobileModalProps> = ({ open, onClose, }) => {

    const [openKeys, setOpenKeys] = useState(['sub1']);

    const items: MenuItem[] = [
        
        getItem(<Link onClick={onClose} to={'/nhanvien/category'}>Quản lý danh mục</Link>, 'order', <BiSolidCategoryAlt />),
        getItem('Sản phẩm','sub5', <BiSolidCategoryAlt />, [
            getItem(<Link onClick={onClose} to={'/nhanvien/product'}>Quản lý sản phẩm</Link>, 'product'),
            getItem(<Link onClick={onClose} to={'/nhanvien/color'}>Màu sắc</Link>, 'color'),
            getItem(<Link onClick={onClose} to={'/nhanvien/size'}>Kích thước</Link>, 'size'),
        ]),
        getItem(<Link onClick={onClose} to={'/nhanvien/order'}>Quản lý đơn hàng</Link>, 'order', <MdOutlineProductionQuantityLimits />),
        getItem(<Link onClick={onClose} to={'/nhanvien/sale'}>Quản lý mã giảm giá</Link>, 'sale', <LiaSalesforce />),

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

export default EditorMobileMenu;