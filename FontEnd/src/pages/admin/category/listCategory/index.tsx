import { useState } from 'react';
import { Avatar, Button, Image, Input, Modal, Popconfirm, Space } from 'antd';
import { SearchProps } from 'antd/es/input';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '@/services/category';
import Skeleton from 'react-loading-skeleton';
import UpdateCategory from '../updateCategory';
import AddCategory from '../addCategory';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { calculatePagination } from '@/components/modal/pagination';
import ReactPaginate from 'react-paginate';
import { DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import Loading from '@/components/ui/Loading';
import { MdDelete, MdOutlineEditCalendar } from "react-icons/md";
const ListCategory = () => {
  const { RangePicker } = DatePicker;

  const [dateRange, setDateRange] = useState([null, null]);

  const { Search } = Input;
  const { data, isLoading } = useGetCategoriesQuery(
    {
      startDate: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
      endDate: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
    }
  );
  const [searchValue, setSearchValue] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [mutate] = useDeleteCategoryMutation();

  const handleSearch: SearchProps['onSearch'] = (value) => {
    setSearchValue(value);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await mutate(id);

      // Kiểm tra dữ liệu trả về từ server
      if (result) {
        // Xử lý lỗi khi xóa dữ liệu
        toast.warning(result.error.data.message);
      } else {
        toast.success('Xóa không thành công');
      }
    } catch (error) {
      toast.success('Xóa thành công');
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await mutate(id);
  //     toast.warning(result.error.data.message);
  //   } catch (error) {
  //     toast.error('Xóa không thành công');
  //   }
  // };

  const handleAddCategory = () => {
    setOpenAddModal(true);
  };

  const handleModalClose = () => {
    setOpenAddModal(false);
    setOpenUpdateModal(false);
  };

  const handleUpdateCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setOpenUpdateModal(true);
  };

  const handleUpdateComplete = () => {
    setSelectedCategoryId('');
    setOpenUpdateModal(false);
  };

  // limit
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 8; // Số sản phẩm hiển thị trên mỗi trang
  const categoryList = data?.docs.filter(category => category.name.includes(searchValue)) || [];

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
      {isLoading ? (
        <Loading />
      ) : (
        <div className="relative overflow-x-auto">
          <div className="pb-4 bg-white dark:bg-gray-900 flex p-3">
            <div>
              <Space direction="vertical">
                <Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
              </Space>
            </div>
            <div className="bg-gray-400 ml-[20px] rounded-md">
              <Button type="primary" className='bg-primary' onClick={handleAddCategory}>
                Thêm danh mục
              </Button>
            </div>
            <div className="flex-grow text-right">
              <RangePicker onChange={handleDateRangeChange} />
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"> */}
            <tr className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 w-full'>
              <td className="pl-6 text-xs font-medium py-3">
                STT
              </td>
              <td className="text-xs font-medium py-3 ">
                Tên danh mục
              </td>
              <td className="text-center text-xs font-medium ">
                Ảnh
              </td>
              <td className="text-center text-xs font-medium py-3">
                Thời gian
              </td>
              <td className="text-center text-xs font-medium py-3">
                Thao tác
              </td>
            </tr>
            {/* </thead> */}
            {/* <tbody> */}
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <Skeleton count={3} className="h-[98px]" />
                </td>
              </tr>
            ) : (
              <>
                {currentPageItems?.map((category, index) => (
                  <tr
                    key={category._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white pl-6">
                      {index + 1}
                    </td>
                    <Link to={`${category._id}/products`}>
                      <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {category.name}
                      </td>
                    </Link>
                    <td className="text-center">
                      <Avatar.Group maxCount={3}>
                        {category.img && category.img[0] && (
                          <div style={{ borderRadius: '50%' }}>
                            <Image
                              src={category.img[0]}
                              alt="image"
                              width={80}
                              height={80}
                            />
                          </div>
                        )}
                      </Avatar.Group>
                    </td>
                    <td className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                      {new Date(category.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 flex items-center justify-center">
                      <Space size="small">
                        <Button type="dashed" className='bg-gree text-layer' onClick={() => handleUpdateCategory(category._id)}>
                          <MdOutlineEditCalendar style={{ fontSize: '18px', }} />
                        </Button>
                        <Popconfirm
                          placement="topRight"
                          title="Bạn Muốn Xóa ?"
                          okText="OK"
                          cancelText="Cancel"
                          okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                          onConfirm={() => handleDelete(category._id)}
                        >
                          <Button type="link" className='bg-reds text-layer'><MdDelete style={{ fontSize: '18px', }} /></Button>
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                ))}
              </>
            )}
            {/* </tbody> */}
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


          <Modal title="Thêm danh mục" centered open={openAddModal} onCancel={handleModalClose} footer={null}>
            <AddCategory handleModalClose={handleModalClose} />
          </Modal>
          {/* Update */}
          <Modal
            title="Cập nhật danh mục"
            centered
            open={openUpdateModal && !!selectedCategoryId}
            onCancel={handleModalClose}
            footer={null}
          >
            {selectedCategoryId && <UpdateCategory categoryId={selectedCategoryId} handleUpdateComplete={handleUpdateComplete} />}
          </Modal>
        </div>
      )}
      <ToastContainer />

    </>
  );
};

export default ListCategory;