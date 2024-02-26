import React from 'react';
import { useMeQuery } from '@/services/auth';
import { useGetUserByIdQuery, useRemoveDiscountCodeFromUserMutation } from '@/services/user';
import { List, Card, Button, Spin } from 'antd';
import { formartVND } from '@/utils/formartVND';
import { toast } from 'react-toastify';
const Discount_code = () => {
  const { data: userData, isLoading: isUserLoading } = useMeQuery();
  const user_id = userData?._id || '';
  const { data: userById, isLoading: isUserByIdLoading } = useGetUserByIdQuery(user_id);

  const listMyVoucher = userById?.data?.discountCodes;
  const [removeDiscountCodeFromUser] = useRemoveDiscountCodeFromUserMutation();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isExpired = (endDate) => {
    return new Date() > new Date(endDate);
  };

  const handleApplyCode = async (voucher) => {
    // Kiểm tra nếu mã giảm giá đã hết hạn thì không áp dụng
    if (isExpired(voucher.endDate)) {
      toast.warning('Mã giảm giá đã hết hạn.');
      return;
    }
    toast.success('Áp dụng mã giảm giá thành công.');
  };

  const handleRemoveCode = async (voucherId) => {
    try {
      await removeDiscountCodeFromUser({ userId: user_id, discountId: voucherId });
      toast.success('Xóa mã giảm giá thành công.');
    } catch (error) {
      toast.error('Xóa mã giảm giá không thành công.');
    }
  };

  if (isUserLoading || isUserByIdLoading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={listMyVoucher}
        renderItem={(voucher) => (
          <List.Item>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{`Mã giảm giá: ${voucher.code}`}</span>
                  {isExpired(voucher.endDate) ? (
                    <Button type="dashed"  onClick={() => handleRemoveCode(voucher._id)}>
                      Xóa mã
                    </Button>
                  ) : (
                    <Button type="primary" onClick={() => handleApplyCode(voucher)}>
                      Áp dụng mã
                    </Button>
                  )}
                </div>
              }
            >
              <p>Giảm giá: {voucher.discount}%</p>
              <p>Đơn hàng: {formartVND(voucher.maxAmount)}</p>
              <p>Ngày bắt đầu: {formatDate(voucher.startDate)}</p>
              <p>Ngày kết thúc : {formatDate(voucher.endDate)}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Discount_code;
