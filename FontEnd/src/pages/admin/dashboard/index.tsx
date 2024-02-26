import AdminMobileMenu from "@/components/modal/AdminMobileMenu";
import {  useMeQuery } from "@/services/auth";
// import { useGetAccountCommentsQuery } from "@/services/comment";
import { useGetOrderStatisticsQuery, useGetRevenueStatisticsQuery } from "@/services/order";
import { useGetTotalProductQuery } from "@/services/product";
import { useGetAccountQuery, useGetAllUserQuery } from "@/services/user";
import { formartVND } from "@/utils/formartVND";
import { Dropdown, MenuProps , Select  } from "antd";
import Ngay from "@/pages/admin/statistical/statisticalday";
import React, { useState } from 'react';
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGetTopSellingProductsQuery } from '@/services/statisticsTop10sanpham';
import moment from 'moment';
import Tuan from "../statistical/statisticalweek";
import Thang from "../statistical/statisticalmonth";
const { Option } = Select;
const DashBoard = () => {
    // const { data: DataComment } = useGetAccountCommentsQuery();
    const { data: DataUser } = useGetAccountQuery()
    const { data: revenueData } = useGetRevenueStatisticsQuery()
    const { data: totalProduct } = useGetTotalProductQuery()
    const { data: DataOrders } = useGetOrderStatisticsQuery()
    const usage = DataUser?.usage ?? 0;
    // const totalComments = DataComment?.totalComments ?? 0;
    const totalP = totalProduct?.total ?? 0;
    const totalRevenue = revenueData?.totalRevenue ?? 0;
    const totalTotal = DataOrders?.totalOrders ?? 0;
    const { data: authData } = useMeQuery();
    const [selectedTest, setSelectedTest] = useState('Tuan');
    const handleTestChange = (value) => {
        setSelectedTest(value);
    };
    const isAdmin = authData?.role === 'admin';
    
    const { data: userData} = useGetAllUserQuery();
    const userList = userData?.docs || [];
    const items: MenuProps['items'] = [

        {
            label: (
                <Link className="text-base" to={'/admin/revenue'}>
                    Thống kê theo ngày 
                </Link>
            ),
            key: '0',
        },
        {
            label: (
                <Link className="text-base" to={'/admin/revenueMoth'}>
                    Thống kê theo tháng 
                </Link>
            ),
            key: '1',
        },
        {
            label: (
                <Link className="text-base" to={'/admin/revenueYear'}>
                    Thống kê theo năm
                </Link>
            ),
            key: '2',
        },
    ];

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               
                <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
                    <div className="flex items-center justify-end">
                        <div className="rounded bg-green-100 p-1 text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <strong className="block text-sm font-medium text-gray-500"> Sản phẩm</strong>

                        <p className="flex items-center">
                            <span className="text-2xl font-medium text-gray-900"> {totalP} </span>
                            <span className="text-xs text-gray-500 px-2"> Tổng số sản phẩm hiện có </span>
                        </p>
                    </div>
                </article>
                {isAdmin && (
                    <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
                        <div className="flex items-center justify-end">
                            <div className="rounded bg-green-100 p-1 text-green-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <strong className="block text-sm font-medium text-gray-500"> User </strong>
                            <p className="flex items-center">
                                <span className="text-2xl font-medium text-gray-900"> {usage}</span>
                                <span className="text-xs text-gray-500 px-2"> User </span>
                            </p>
                        </div>
                    </article>
                )}
                 <article
                    className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6"
                >
                    <div
                        className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                    </div>

                    <div>
                        <strong className="block text-sm font-medium text-gray-500"> Tổng đơn hàng </strong>

                        <p>
                            <span className="text-2xl font-medium text-gray-900"> {totalTotal}</span>

                            <span className="text-xs text-gray-500"> đơn hàng </span>
                        </p>
                    </div>

                </article>
                < article className="flex flex-col  rounded-lg border border-gray-100 bg-white p-6">

                    <div>
                        <Dropdown
                            arrow
                            trigger={['click']}
                            placement="bottomRight"
                            menu={{ items }}
                        >
                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 p-1"
                                aria-expanded="false"
                                data-dropdown-toggle="dropdown-user"
                            >
                                {/* <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg> */}
                                xem thêm
                            </button>
                        </Dropdown>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="rounded bg-green-100 p-1 text-green-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <strong className="block text-sm font-medium text-gray-500"> Doanh thu </strong>

                        <p className="flex items-center">
                            <span className="text-lg font-medium text-gray-900"> {formartVND(totalRevenue)} </span>
                            <span className="text-xs text-gray-500 px-1"> VND </span>
                        </p>
                    </div>
                </article>
               
            </div>
            <div className="sm:grid-cols-2 md:grid-cols-4 mb-4 w-[370px]">
               <article className="flex flex-col rounded-lg border border-gray-100 bg-white p-10">
                    <div>
                        <Select defaultValue="Tuan" onChange={handleTestChange} className="w-full">
                            <Option value="Tuan">Top 10 sản phẩm bán chạy trong tuần </Option>
                            <Option value="Thang">Top 10 sản phẩm bán chạy trong tháng </Option>
                            <Option value="Ngay">Top 10 sản phẩm bán chạy trong ngày </Option>
                        </Select>
                    </div>
                </article> 
                
            </div>
            
            <div>
                {selectedTest === 'Tuan' && <Tuan />}
                {selectedTest === 'Thang' && <Thang />}
                {selectedTest === 'Ngay' && <Ngay />}
            </div>
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tài khoản
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Chức vụ
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user) => (
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
                                    
                                </tr>
                            ))}
                        </tbody>

                        
                    </table>
                </div>
                
            </div>
        </>
    )
}

export default DashBoard