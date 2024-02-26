import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { waiting } from '@/utils/waiting';
import { PaginatedDiscount } from '@/types/discount';
export type IDiscount = {
    _id: number | string,
    code: string;
    discount: number;
    count: number;
    maxAmount: number;
    startDate: Date;
    endDate: Date;
};
const discountuserApi = createApi({
    reducerPath: 'discountsuser',
    tagTypes: ['Discountsuser'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        fetchFn: async (...arg) => {
            await waiting(2000);
            return fetch(...arg);
        },
    }),
    endpoints: (builder) => ({
      // hien thi tat ca cho nguoi dung xem thong tin ma giam gia
      getAllDiscountUsers: builder.query<PaginatedDiscount , void>({
        query: () => '/discountsuser',
        providesTags: ['Discountsuser'],
      }),
      // them ma giam gia vao cho nguoi dung
      saveDiscountToAnother: builder.mutation<IDiscount, number>({
            query: (discountId) => ({
              url: `/discountsuser/${discountId}`,
              method: 'POST',
              invalidatesTags: ['Discountsuser'],
            }),
          }),
      // xoa ma giam gia khi thanh toan thanh cong
      deleteDiscountUsers: builder.mutation<any  , string>({
        query: (discountId) => ({
          url: `/discountsuser/${discountId}`,
          method: 'DELETE',
          invalidatesTags: ['Discountsuser'],
        }),
      }),
    }),
});
console.log()
export const {
      useGetAllDiscountUsersQuery,
      useSaveDiscountToAnotherMutation,
      useDeleteDiscountUsersMutation,
} = discountuserApi;
export default discountuserApi;