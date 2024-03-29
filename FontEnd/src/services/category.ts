import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { waiting } from '@/utils/waiting';
import { PaginatedCategory } from '@/types/category';
import { ProductType } from '@/types/Product';

export type TCategory = {
    _id: string;
    name: string;
    img: string;
    createdAt: string;
    updateAt: string;
    products: ProductType[];
};

const categoryApi = createApi({
    reducerPath: 'category',
    tagTypes: ['Category'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        fetchFn: async (...arg) => {
            await waiting(2000);
            return fetch(...arg);
        },
    }),
    endpoints: (builder) => ({
        getCategories: builder.query<PaginatedCategory, { startDate?: string; endDate?: string }>({
            query: ({ startDate, endDate }) => ({
                url: '/categories',
                method: 'GET',
                params: {
                    startDate,
                    endDate,
                },
            }),
            providesTags: ['Category'],
        }),
        getCatgoryById: builder.query<TCategory, string>({
            query: (_id) => `/categories/${_id}`,
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation<TCategory, string>({
            query: (category) => ({
                url: '/categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (categoryId) => ({
                url: `/categories/${categoryId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),

        updateCategory: builder.mutation<TCategory, { categoryId: string; category: Partial<TCategory> }>({
            query: ({ categoryId, category }) => ({
                url: `/categories/${categoryId}`,
                method: 'PUT',
                body: { ...category, updateAt: new Date().toISOString() },

            }),
            invalidatesTags: ['Category'],
        }),
        getProductsByCategory: builder.query<ProductType[], { categoryIds: string; }>({
            query: ({ categoryIds }) => ({
                url: '/products/categories',
                method: 'POST',
                body: { categoryIds },
            }),
        }),
    }),
});

export const { useGetCategoriesQuery, useGetCatgoryByIdQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation, useGetProductsByCategoryQuery } = categoryApi;
export default categoryApi;