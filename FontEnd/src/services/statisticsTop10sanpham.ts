
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { waiting } from '@/utils/waiting';
import { Products } from '@/types/statistics';
interface Product {
      _id: string;
      quantity: number;
      name : string ;
      createdAt : string,
      updatedAt : string ,
    }

export const StatisticsTopapi = createApi({
      baseQuery: fetchBaseQuery({
            baseUrl: 'http://localhost:8080/api',
            fetchFn: async (...arg) => {
                  await waiting(1000);
                  return fetch(...arg);
            },
      }),
      endpoints: (builder) => ({
            getTopSellingProducts: builder.query<Product[], void>({
                  query: () => 'top-selling-products',
            }),
            getTopSellingProductsWeek: builder.query<Products[], void>({
                  query: () => 'startOfWeek',
            }),
            getTopSellingProductsMonth: builder.query<Products[], void>({
                  query: () => 'startOfMonth',
            }),
      }),
});

export const { useGetTopSellingProductsQuery, useGetTopSellingProductsWeekQuery, useGetTopSellingProductsMonthQuery } = StatisticsTopapi;
export default StatisticsTopapi
