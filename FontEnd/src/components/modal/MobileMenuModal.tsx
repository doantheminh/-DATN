import { Drawer, Menu } from 'antd';
import { FunctionComponent, Key, ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { BsGear } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { LiaProductHunt, LiaSalesforce } from 'react-icons/lia';
import type { MenuProps } from 'antd';

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

const MobileMenuModal: FunctionComponent<MobileModalProps> = ({ open, onClose }) => {

    const [openKeys, setOpenKeys] = useState(['sub1']);

    const items: MenuItem[] = [
        getItem(<Link onClick={onClose} to={'/'}>Trang chủ</Link>, 'sub-home', <AiFillHome />),
        getItem(<Link onClick={onClose} to={'/filter'}>Cửa hàng</Link>, 'filter', <LiaProductHunt />),
        getItem(<Link onClick={onClose} to={'/code_ma'}>Mã giảm giá</Link>, 'code_ma', <LiaSalesforce />),

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

export default MobileMenuModal;
