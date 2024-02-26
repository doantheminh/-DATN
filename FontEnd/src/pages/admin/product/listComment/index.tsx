import { calculatePagination } from "@/components/modal/pagination";
import { useMeQuery } from "@/services/auth";
import { useGetAllOrderCommentsQuery, useRemoveOrderCommentMutation, useReplyToOrderCommentMutation } from "@/services/ordercomments";
import { Button, DatePicker, Empty, Image, Modal, Popconfirm, Rate, Skeleton, Space } from "antd";
import Input, { SearchProps } from "antd/es/input";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from 'react-toastify';
import Ashirt from "../../../../../public/Ashirt.png"
import './comment.css';
import ListReply from "./list-reply";
import { BiCommentDetail } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const ListComment = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const { RangePicker } = DatePicker;

  const { data: commentData, isLoading } = useGetAllOrderCommentsQuery(
    {
      startDate: dateRange && dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '',
      endDate: dateRange && dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '',

    }
  );

  const handleDateRangeChange = (dates: any, dateStrings: any) => {

    setDateRange(dates);
  };
  const [mutate] = useRemoveOrderCommentMutation();
  const [replyLoading, setReplyLoading] = useState(false);

  const { data: authData } = useMeQuery();
  // Lọc comments với productId trùng khớp với useParams()
  const handleDeleteComment = async (id: string) => {
    try {
      await mutate(id);
      toast.success('Xóa thành công');
    } catch (error) {
      toast.error('Xóa không thành công');
    }
  };

  // limit
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 8; // Số sản phẩm hiển thị trên mỗi trang
  const paginationOptions = {
    currentPage,
    perPage,
    totalCount: commentData?.length || 0,
    data: commentData || [],
  };

  const { pageCount, currentPageItems } = calculatePagination(paginationOptions);

  const handlePageChange = (selectedPage: any) => {
    setCurrentPage(selectedPage.selected);
  };
  const [open, setOpen] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const showModal = (commetId: any) => {
    setModalCommentId(commetId); // Lưu trữ commentId trong trạng thái modalCommentId

    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const [searchValue, setSearchValue] = useState('');

  const handleSearch: SearchProps['onSearch'] = (value) => {
    setSearchValue(value);
  };

  const handleReplyButtonClick = () => {
    setShowReplyInput(true);
  };
  const [mutateCreateProduct] = useReplyToOrderCommentMutation();
  const [modalCommentId, setModalCommentId] = useState(null);

  const handleReplySubmit = async (commentId: any) => {
    try {
      const userId = currentPageItems[currentPage]?.userId?._id || '';
      await mutateCreateProduct({ userId, commentId, replyText });
      setShowReplyInput(false);
      setReplyText('');
      toast.success('Bạn đã trả lời đánh giá này');
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleToggleReplies = () => {
    setShowAllReplies(!showAllReplies);
  };


  return (
    <div>

      <div className="flex-grow text-right">
        <RangePicker onChange={handleDateRangeChange} />
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">

        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="pl-6 text-xs font-medium py-3">
              Tên người dùng
            </th>
            <th scope="col" className="pl-6 text-xs font-medium py-3">
              Bình Luận
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
              <td colSpan={4}>
                <Skeleton className="h-[98px]" />
              </td>
            </tr>
          )
            : currentPageItems.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </td>
              </tr>
            )
              : (
                currentPageItems?.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="py-4 font-medium text-gray-600 whitespace-nowrap dark:text-white pl-6">
                      {item.userId.username}
                    </td>
                    <td className="py-4 font-medium text-gray-600 whitespace-nowrap dark:text-white pl-6">
                      {item.text}
                    </td>
                    <td className="py-4 font-medium text-gray-600 whitespace-nowrap dark:text-white text-center">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 flex items-center justify-center">
                      <Space size="small">
                        <Popconfirm
                          placement="topRight"
                          title="Bạn Muốn Xóa ?"
                          okText="OK"
                          cancelText="Cancel"
                          okButtonProps={{ style: { backgroundColor: 'red', color: 'white' } }}
                          onConfirm={() => handleDeleteComment(item._id!)}
                        >
                          <Button type="link" className="bg-reds text-layer mr-3"><MdDelete style={{ fontSize: '18px', }} /></Button>
                        </Popconfirm>
                      </Space>
                      <Space>
                        <Button type="primary" className="bg-primary" onClick={() => showModal(item._id)}>
                          <BiCommentDetail style={{ fontSize: '18px', }} />
                        </Button>

                        <Modal
                          open={open}
                          title="Chi tiết đánh giá"
                          onOk={handleOk}
                          onCancel={handleCancel}
                          footer={(_, { CancelBtn }) => (
                            <>
                              {showReplyInput ? (
                                <div className="p-2">
                                  <Input.TextArea
                                    rows={4}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                  <div className="p-2 ">
                                    <Button className="bg-cyan-300 text-slate-950" onClick={() => handleReplySubmit(modalCommentId)}>
                                      Gửi
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <Button type="default" onClick={handleReplyButtonClick}>
                                  Trả lời
                                </Button>
                              )}
                            </>
                          )}
                        >
                          {/* {item?.userId?.username} */}
                          <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold p-2">
                            <img
                              className="mr-2 w-6 h-6 rounded-full"
                              src={
                                authData?.avatar
                              }
                              alt="Michael Gough"
                            />
                            {item?.userId?.username}

                          </p>
                          <ListReply productId={modalCommentId} />

                        </Modal>
                      </Space>
                    </td>

                  </tr>

                ))
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
    </div >
  );
};

export default ListComment;