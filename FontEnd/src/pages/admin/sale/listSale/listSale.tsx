import { useState } from 'react';
import { Button, Input, Modal, Popconfirm, Space, Table, DatePicker } from 'antd';
import { SearchProps } from 'antd/es/input';
import { useGetDiscountsQuery, useDeleteDiscountsMutation } from '@/services/discount';
import Skeleton from 'react-loading-skeleton';
import UpdateSale from '../updateSale/updateSale';
import AddSale from '../addSale/index';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formartVND } from '@/utils/formartVND';
import { MdOutlineEditCalendar } from 'react-icons/md';

const ListSale = () => {
  const { Search } = Input;
  const { RangePicker } = DatePicker;

  const [dateRange, setDateRange] = useState([null, null]);
  const [searchValue, setSearchValue] = useState('');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedDiscount, setSelectedDiscountId] = useState('');
  const [mutate] = useDeleteDiscountsMutation();

  const { data, isLoading } = useGetDiscountsQuery({
    startDate: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
    endDate: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',
  });

  const handleDateRangeChange = (dates: any, dateStrings: any) => {
    setDateRange(dates);
  };

  const handleSearch: SearchProps['onSearch'] = (value) => {
    setSearchValue(value.toLowerCase());
  };

  const handleDelete = async (id: string) => {
    try {
      await mutate(id);
      toast.success('Xóa thành công');
    } catch (error) {
      toast.error('Xóa không thành công');
    }
  };

  const handleAddDiscount = () => {
    setOpenAddModal(true);
  };

  const handleModalClose = () => {
    setOpenAddModal(false);
    setOpenUpdateModal(false);
  };

  const handleUpdatediscount = (categoryId: string) => {
    setSelectedDiscountId(categoryId);
    setOpenUpdateModal(true);
  };

  const handleUpdateComplete = () => {
    setSelectedDiscountId('');
    setOpenUpdateModal(false);
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const DiscountList = data?.docs
    .filter(category => category.code.toLowerCase().includes(searchValue))
    .filter(category =>
      (!dateRange[0] || new Date(category.startDate) >= dateRange[0]) &&
      (!dateRange[1] || new Date(category.endDate) <= dateRange[1])
    ) || [];

  const columns = [
    {
      title: 'Code Mã',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Giá trị giảm giá(%)',
      dataIndex: 'discount',
      key: 'discount',
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      render: (text) => (
        <span style={{ color: text === 0 ? 'red' : 'inherit' }}>
          {text}
        </span>
      ),
    },
    {
      title: ' Đơn hàng >= số tiền (VND)  ',
      dataIndex: 'maxAmount',
      key: 'maxAmount',
      render: (text) => formartVND(text),
    },
    {
      title: 'Thời Gian tạo',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Thời Gian kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      render: (text) => (
        <span style={{ color: isExpired(text) ? 'red' : '' }}>
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text, record) => (
        <Space size="small">
          <Button className='bg-gree' type="dashed" onClick={() => handleUpdatediscount(record._id)}>
            <MdOutlineEditCalendar style={{ fontSize: '18px', color: 'white' }}/>
          </Button>
          {isExpired(record.endDate) && (
            <Popconfirm
              placement="topRight"
              title="Bạn Muốn Xóa ?"
              okText="OK"
              cancelText="Cancel"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button className='bg-reds ' type="link">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="relative overflow-x-auto">
        <div className="pb-4 bg-white dark:bg-gray-900 flex p-3">
          <div>
            <Space direction="vertical">
              <Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
            </Space>
          </div>
          <div className="bg-gray-400 ml-[20px] rounded-md">
            <Button type="primary" className='bg-primary' onClick={handleAddDiscount}>
              Thêm mã giảm giá
            </Button>
          </div>
          <div className="flex-grow text-right">
            <RangePicker onChange={handleDateRangeChange} />
          </div>
        </div>

        <Table
          dataSource={DiscountList}
          columns={columns}
          loading={isLoading}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          onChange={(pagination, filters, sorter) => {}}
        />
        <Modal title="Thêm mã giảm giá" centered open={openAddModal} onCancel={handleModalClose} footer={null}>
          <AddSale handleModalClose={handleModalClose} />
        </Modal>
        <Modal
          title="Cập nhật mã giảm giá"
          centered
          open={openUpdateModal && !!selectedDiscount}
          onCancel={handleModalClose}
          footer={null}
        >
          {selectedDiscount && <UpdateSale categoryId={selectedDiscount} handleUpdateComplete={handleUpdateComplete} />}
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
}

export default ListSale;
