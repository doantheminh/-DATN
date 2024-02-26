import { useState } from 'react';
import { Button, Input, Modal, Popconfirm, Select, Space } from 'antd';
import { SearchProps } from 'antd/es/input';
import Skeleton from 'react-loading-skeleton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calculatePagination } from '@/components/modal/pagination';
import ReactPaginate from 'react-paginate';
import { useGetAllSizeQuery, useRemoveSizeMutation } from '@/services/size';
import AddSize from '../addSize';
import UpdateSize from '../updateSize';
import { DatePicker } from 'antd';
import { MdOutlineEditCalendar } from 'react-icons/md';

const { Option } = Select;
const ListSize = () => {
  const { Search } = Input;
  const [dateRange, setDateRange] = useState([null, null]);

  const { data, isLoading } = useGetAllSizeQuery({
    startDate: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
    endDate: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
  });
  const handleDateRangeChange = (dates: any, dateStrings: any) => {

    setDateRange(dates);
  };
  const { RangePicker } = DatePicker;

  const [searchValue, setSearchValue] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState('');
  // const [mutate] = useRemoveSizeMutation();


  const handleSearch: SearchProps['onSearch'] = (value) => {
    setSearchValue(value);
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await mutate(id);
  //     toast.success('Xóa thành công');
  //   } catch (error) {
  //     toast.error('Xóa không thành công');
  //   }
  // };

  const handleAddSize = () => {
    setOpenAddModal(true);
  };

  const handleModalClose = () => {
    setOpenAddModal(false);
    setOpenUpdateModal(false);
  };

  const handleUpdateSize = (sizeId: string) => {
    setSelectedSizeId(sizeId);
    setOpenUpdateModal(true);
  };

  const handleUpdateComplete = () => {
    setSelectedSizeId('');
    setOpenUpdateModal(false);
  };

  const [filterRole, setFilterRole] = useState('');

  // limit
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 8; // Số sản phẩm hiển thị trên mỗi trang
  const sizeList = data?.docs.filter((size) => {
    const nameMatch = size?.name?.toLowerCase().includes(searchValue.toLowerCase());
    const activeMatch = filterRole ? size.active === (filterRole === 'true') : true;
    return nameMatch && activeMatch;
  }) || [];

  const paginationOptions = {
    currentPage,
    perPage,
    totalCount: sizeList.length,
    data: sizeList,
  };

  const { pageCount, currentPageItems } = calculatePagination(paginationOptions);

  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };

  const isActive = (active: any) => {
    return active ? 'Hoạt động' : 'Không hoạt động';
  };


  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="pb-4 bg-white dark:bg-gray-900 flex p-3">
          <Select
            placeholder="Chọn Trang thái"
            onChange={(value) => setFilterRole(value)}
            style={{ width: 200 }}
          >
            <Option value="">Tất cả</Option>
            <Option value="true">Hoạt động</Option>
            <Option value="false">Không hoạt động</Option>
          </Select>
          <div>
            <Space direction="vertical">
              <Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
            </Space>
          </div>
          <div className="bg-gray-400 ml-[20px] rounded-md">
            <Button type="primary" className='bg-primary' onClick={handleAddSize}>
              Thêm kích thước
            </Button>
          </div>
          <div className="flex-grow text-right">
            <RangePicker onChange={handleDateRangeChange} />
          </div>
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="pl-6 text-xs font-medium py-3">
                Tên kích thước
              </th>
              <th scope="col" className="text-center text-xs font-medium py-3">
                Trạng thái
              </th>
              <th scope="col" className="text-center text-xs font-medium py-3">
                Thời Gian
              </th>
              <th scope="col" className="text-center text-xs font-medium py-3">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <Skeleton count={3} className="h-[98px]" />
                </td>
              </tr>
            ) : (
              <>
                {currentPageItems?.map((size) => (
                  <tr
                    key={size._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white pl-6">
                      {size.name}
                    </td>
                    <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {isActive(size.active)}
                    </td>
                    <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {new Date(size.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 flex items-center justify-center">
                      <Space size="small">
                        <Button type="dashed" className='bg-gree text-layer' onClick={() => handleUpdateSize(size._id)}>
                          <MdOutlineEditCalendar style={{ fontSize: '18px', }}/>
                        </Button>
                        {/* <Popconfirm
                          placement="topRight"
                          title="Bạn Muốn Xóa ?"
                          okText="OK"
                          cancelText="Cancel"
                          okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                          onConfirm={() => handleDelete(size._id)}
                        >
                          <Button type="link" className='bg-reds text-layer'>Delete</Button>
                        </Popconfirm> */}
                      </Space>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
          <div className='mt-4 d-flex justify-content-start align-items-start'>
            <ReactPaginate
              previousLabel={'Quay lại'}
              nextLabel={'Tiếp theo'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName={'pagination flex justify-center gap-1 text-xs font-medium'}
              activeClassName={'block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-blue-500'}
              pageClassName={'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'}
              previousClassName={'inline-flex  w-[60px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'}
              nextClassName={'inline-flex  w-[70px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'}
              previousLinkClassName={'h-8 p-1 leading-6 '}
              nextLinkClassName={'h-8 p-1 leading-6 '}
              breakClassName={'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'}
            />
          </div>

        </table>

        <Modal title="Thêm kích thước" centered open={openAddModal} onCancel={handleModalClose} footer={null}>
          <AddSize handleModalClose={handleModalClose} />
        </Modal>
        {/* Update */}
        <Modal
          title="Cập nhật kích thước"
          centered
          open={openUpdateModal && !!selectedSizeId}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedSizeId && <UpdateSize sizeId={selectedSizeId} handleUpdateComplete={handleUpdateComplete} />}
        </Modal>

      </div>
      <ToastContainer />
    </>
  );
};

export default ListSize;