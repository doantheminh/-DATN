import { Button, Input, Modal, Select, Space } from 'antd';
import { SearchProps } from 'antd/es/input';
import UpdateUser from './updateUser';
import { useGetAllUserQuery } from '@/services/user';
import { Link } from 'react-router-dom';
import Loading from '@/components/ui/Loading';
import { useState } from 'react';
import { calculatePagination } from '@/components/modal/pagination';
import ReactPaginate from 'react-paginate';
import { DatePicker } from 'antd';
import { MdOutlineEditCalendar } from 'react-icons/md';

const { Option } = Select;
const ListUser: React.FC = () => {
    const [dateRange, setDateRange] = useState<any>([null, null]);
    const { RangePicker } = DatePicker;

    const { data: userData, isLoading: userLoading } = useGetAllUserQuery({
        startDate: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
        endDate: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
    });
    const [searchValue, setSearchValue] = useState('');

    const { Search } = Input;
    const [open, setOpen] = useState(false);

    const onShow = () => {
        setOpen(true);
    };

    const handleSearch: SearchProps['onSearch'] = (value) => {
        setSearchValue(value);
    };
    const [filterRole, setFilterRole] = useState('');
    // limit
    const [currentPage, setCurrentPage] = useState(0);
    const perPage = 9; // Số sản phẩm hiển thị trên mỗi trang

    // const categoryList =
    //     userData?.docs.filter(
    //         (auth) =>
    //             (auth?.username?.toLowerCase().includes(searchValue.toLowerCase()) ||
    //                 auth.email?.toLowerCase().includes(searchValue.toLowerCase())) &&
    //             (filterRole ? auth.role?.toLowerCase() === filterRole.toLowerCase() : true),
    //     ) || [];
    const categoryList =
    userData?.docs.filter((auth) => {
        const usernameSearch = auth?.username?.toLowerCase().includes(searchValue.toLowerCase());
        const emailSearch = auth.email?.toLowerCase().includes(searchValue.toLowerCase());
        const roleSearch = auth.role?.toLowerCase().includes(searchValue.toLowerCase());
        const roleMatch = filterRole ? auth.role?.toLowerCase() === filterRole.toLowerCase() : true;

        return (usernameSearch || emailSearch || roleSearch) && roleMatch;
    }) || [];

    const paginationOptions = {
        currentPage,
        perPage,
        totalCount: categoryList.length,
        data: categoryList,
    };

    const { pageCount, currentPageItems } = calculatePagination(paginationOptions);

    const handlePageChange = (selectedPage: any) => {
        setCurrentPage(selectedPage.selected);
    };
    const handleDateRangeChange = (dates: any, dateStrings: any) => {
        setDateRange(dates);
    };
    return (
        <>
            {userLoading ? (
                <Loading />
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900 p-3">
                        <Select
                            placeholder="Chọn chức vụ"
                            onChange={(value) => setFilterRole(value)}
                            style={{ width: 200 }}
                        >
                            <Option value="">Tất cả</Option>
                            <Option value="admin">Admin</Option>
                            <Option value="nhanvien">Nhân viên</Option>
                            <Option value="khachhang">Khách hàng</Option>
                        </Select>
                        <label className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <Space direction="vertical">
                                <Search
                                    placeholder="Tìm kiếm"
                                    onSearch={handleSearch}
                                    style={{ width: 200 }}
                                />
                            </Space>
                        </div>
                        <div className="flex-grow text-right">
                            <RangePicker onChange={handleDateRangeChange} />
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tài khoản
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Chức vụ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageItems.map((user) => (
                                <tr
                                    key={user._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <th
                                        scope="row"
                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={
                                                user.avatar ||
                                                'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'
                                            }
                                            alt="Jese image"
                                        />
                                        <p className="pl-3 space-x-2">
                                            <span className="text-base font-semibold">{user.username}</span>
                                            <span className="font-normal text-gray-500">{user.email}</span>
                                        </p>
                                    </th>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <Link to={`/admin/user/update/${user._id}`}>
                                            <Button type="dashed" className="bg-gree text-layer" onClick={onShow}>
                                                <MdOutlineEditCalendar style={{ fontSize: '18px', }}/>
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <Modal
                            title="Update User"
                            centered
                            open={open}
                            onOk={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                            width={1000}
                        >
                            <UpdateUser />
                        </Modal>
                        <div className="mt-4 p-3 d-flex justify-content-start align-items-start">
                            <ReactPaginate
                                previousLabel={'Quay lại'}
                                nextLabel={'Tiếp theo'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination flex justify-center gap-1 text-xs font-medium'}
                                activeClassName={
                                    'block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-blue-500'
                                }
                                pageClassName={
                                    'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'
                                }
                                previousClassName={
                                    'inline-flex  w-[60px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                                }
                                nextClassName={
                                    'inline-flex  w-[70px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                                }
                                previousLinkClassName={'h-8 p-1 leading-6 '}
                                nextLinkClassName={'h-8 p-1 leading-6 '}
                                breakClassName={
                                    'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'
                                }
                            />
                        </div>
                    </table>
                </div>
            )}
        </>
    );
};

export default ListUser;
