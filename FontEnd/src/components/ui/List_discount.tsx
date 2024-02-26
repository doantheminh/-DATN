import React, { useEffect, useState } from 'react';
import { useApplyDiscountMutation, useGetDiscountsQuery } from '@/services/discount';
import { List, Card, Button } from 'antd';
import { formartVND } from '@/utils/formartVND';
import { useMeQuery } from "@/services/auth";
import { toast } from 'react-toastify';
import { useGetsOrderQuery } from '@/services/order';
import { useAddDiscountCodeToUserMutation } from '@/services/user';
const List_discount = () => {
  const { data: discountsData, isLoading, isError } = useGetDiscountsQuery();
  const [applyDiscountMutation] = useApplyDiscountMutation();
  const [savedDiscounts, setSavedDiscounts] = useState([]);
  const { data: userData } = useMeQuery();
  console.log('1', userData)
  if (userData && userData.orders) {
    console.log('Danh sách ID đơn hàng của người dùng:', userData);
  }
  const { data: orderData, } = useGetsOrderQuery(); // Fetch order data
  const userIdsInOrder = orderData?.docs.map(order => order.userId).filter(userId => userId);
  const [hasDiscountInOrder, setHasDiscountInOrder] = useState(false);
  const [discountInOrder, setDiscountInOrder] = useState(false);
  const [addDiscountCodeToUserMutation] = useAddDiscountCodeToUserMutation();
  useEffect(() => {
    if (orderData) {
      const hasDiscount = orderData.docs.some(order => order.discountCode && order.discountCode.length > 0);
      setHasDiscountInOrder(hasDiscount);
    }
  }, [orderData]);
  useEffect(() => {
    if (orderData) {
      const hasDiscount = orderData.docs.some(order => order.discountCode && order.discountCode.length > 0);
      setDiscountInOrder(hasDiscount);
    }
  }, [orderData]);

  useEffect(() => {
    if (userData) {
      setSavedDiscounts(userData.discountCodes);
    }
  }, [userData]);
  const handleApplyDiscount = async (discountId: any) => {
    const result = await applyDiscountMutation(discountId);
    return result;
  };

  const handleAddSale = async (discount: any) => {
    try {
      if (discount.count === 0) {
        toast.error('Mã giảm giá đã hết!', { position: 'bottom-right' });
        return;
      }
      if (!userData) {
        toast.error('Đăng nhập mới thêm được mã giảm giá', { position: 'bottom-right' });
        return;
      }

      const alreadyHasDiscount = userData?.discountCodes.includes(discount._id);
      if (alreadyHasDiscount) {
        toast.info('Bạn đã lưu mã giảm giá này rồi!', { position: 'bottom-right' });
        return;
      }

      const confirmed = window.confirm(`Bạn có chắc muốn thêm mã giảm giá: ${discount.discount}% không?`);
      if (confirmed) {
        const result = await addDiscountCodeToUserMutation({
          discountId: discount._id,
          userId: userData._id,
        });

        // Apply the discount to the order after adding it to the user
        const applyDiscountResult = await applyDiscountMutation(discount._id);

        if (!result.error && !applyDiscountResult.error) {
          setSavedDiscounts([...savedDiscounts, discount._id]);
          toast.success(`Đã thêm và áp dụng mã giảm giá: ${discount.discount}%`, { position: 'bottom-right' });
        } else {
          toast.error(result.error?.message || applyDiscountResult.error?.message, { position: 'bottom-right' });
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu mã giảm giá:', error);
      toast.error('Có lỗi xảy ra khi lưu mã giảm giá!', { position: 'bottom-right' });
    }
  };


  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching discounts</div>;
  }
  return (
    <div className='max-w-5xl px-2 lg:px-4 w-full mx-auto '>
      <h2 className='text-2xl my-3'>Các mã giảm giá có trong của hàng </h2>
      <List
  grid={{ gutter: 16, column: 3 }}
  dataSource={discountsData?.docs}
  renderItem={discount => (
    <List.Item>
      <Card title={`Mã : ${discount.code}`} extra={
        <Button
          className='text-primary bg-layer p-2 rounded-md my-2'
          onClick={() => { handleAddSale(discount); }}
          disabled={
            savedDiscounts.includes(discount._id) || (orderData?.docs.some(order => order.discountCode?.includes(discount._id) && order.userId === userData?._id))
          }
        >
          {savedDiscounts.includes(discount._id) ? (
            'Đã lưu mã'
          ) : orderData?.docs.some(order => order.discountCode?.includes(discount._id) && order.userId === userData?._id) ? (
            <span style={{ color: 'green' }}>Mã trong đơn hàng</span>
          ) : (
            'Thêm mã'
          )}
        </Button>
      }>
        <p>Giảm giá : {discount.discount}%</p>
        <p>Đơn hàng tối thiểu: {formartVND(discount.maxAmount)}</p>
        {discount.count === 0 ? (
          <p style={{ color: 'red' }}>Hết mã</p>
        ) : (
          <p>Mã trong cửa hàng {(discount?.count)} cái</p>
        )}
        <p>HSD: {formatDate(discount.startDate)}-{formatDate(discount.endDate)}</p>
      </Card>
    </List.Item>
  )}
/>
    </div>
  );

};

export default List_discount




