import AdminLayout from '@/components/layout/AdminLayout';
import MainLayout from '@/components/layout/MainLayout';
import DashBoard from '@/pages/admin/dashboard';

import AccountDetail from '@/pages/user/account-detail/AccountDetail';

import Cart from '@/pages/user/cart/Cart';
import FilterProducts from '@/pages/user/filter/FilterProducts';
import Home from '@/pages/user/home/Home';
import ProductDetail from '@/pages/user/productdetail/ProductDetail';
import Signin from '@/pages/user/signin';
import Signup from '@/pages/user/signup';
import { Navigate, Outlet, createBrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import ListUser from '@/pages/admin/user/listUser';
import AppTest from '@/pages/admin/category/test';
import ListOrder from '@/pages/admin/order/listorder';
import ListProduct from '@/pages/admin/product/listProduct';
import Error from '@/pages/error/Error';
import LocationList from '@/pages/user/checkout/Checkout';
import UpdateUser from '@/pages/admin/user/updateUser';
import ForgotPassword from '@/pages/user/forgot-password/ForgotPassword';
import ChangePassword from '@/pages/user/change-password/ChangePassword';
import ListComment from '@/pages/admin/product/listComment';
import YourFavourite from '@/pages/user/your-favourite';
import OrderSumeries from '@/pages/user/orders/OrderSumeries';
import CheckoutSuccess from '@/pages/user/success/CheckoutSuccess';
import CancelCheckout from '@/pages/user/cancelled/CancelCheckout';
import Hoandon from '@/pages/user/orders/Hoandon';
import ListSale from '@/pages/admin/sale/listSale/listSale';
import View_account from '@/pages/user/view_account';
import Discount_code from '@/pages/user/discount';
import ListColor from '@/pages/admin/color/listColor';
import ListSize from '@/pages/admin/size/listSize';
import ListCategory from '@/pages/admin/category/listCategory';
import Listbrand from '@/pages/admin/trademark/listtrademark';
import { useMeQuery } from '@/services/auth';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import List_discount from '@/components/ui/List_discount';
import Revenue from '@/pages/admin/dashboard/revenue';
import RevenueMoth from '@/pages/admin/dashboard/revenueMoth';
import RevenueYear from '@/pages/admin/dashboard/revenueYear';
import ProductsbyCategory from '@/pages/admin/category/productsByCategory';
import Thongke from '@/pages/admin/statistical/Thongke';
import ProductsOfCategory from '@/components/category/CategoryOfproducts';
import VerifyEmail from '@/pages/user/verify-email/VerifyEmail';
import ProductDetails from '@/pages/admin/product/listProduct/productDetails';
import Test from '@/pages/admin/statistical/statisticalday';
import Test2 from '@/pages/admin/statistical/statisticalweek';
import Test3 from '@/pages/admin/statistical/statisticalmonth';
import EditorLayout from '@/components/layout/EditorLayout';

const PrivateRoute = ({ isAuth }: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = useMeQuery();
    // console.log(data?.role);
    useEffect(() => {
        if (!isAuth) {
            navigate('/account/signin');
        } else if (data?.role === 'admin' && !location.pathname.startsWith('/admin')) {
            toast.warning('Bạn không thể truy cập trang web với tài khoản này !!!', { position: 'top-right' });
            navigate('/admin/dashboard');
        }else if (data?.role === "nhanvien" && !location.pathname.startsWith("/nhanvien")) {
            toast.warning('Bạn không có quyền truy cập ', { position: 'top-right' });
            navigate('/nhanvien/category');
        }
         else if (data?.role === "khachhang" && location.pathname.includes("/admin") && location.pathname.includes("/nhanvien")) {
            toast.warning('Bạn không có quyền truy cập ', { position: 'top-right' });
            navigate("/error");
        } 
    }, [isAuth, data, location]);
    return <Outlet />;
};
const router = createBrowserRouter([
    // Main layout
    {
        path: '*',
        element: <Error />,
    },
    {
        path: '/',
        element: <PrivateRoute isAuth={true} />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: <Navigate to="home" /> },
                    {
                        path: 'home',
                        element: <Home />,
                    },
                    {
                        path: 'cart',
                        element: <Cart />,
                    },
                    {
                        path: 'filter',
                        element: <FilterProducts />,
                    },
                    {
                        path: 'detail/:id',
                        element: <ProductDetail />,
                    },
                    {
                        path: 'checkout',
                        element: <LocationList />,
                    },
                    {
                        path: 'your-favorite',
                        element: <YourFavourite />,
                    }, {
                        path: 'orders/:userId',
                        element: <OrderSumeries />
                    },
                    {
                        path: 'code_ma',
                        element: <List_discount />
                    },
                    {
                        path: 'category/:categoryId',
                        element: <ProductsOfCategory />
                    },
                    {
                        path: '/details',
                        element: <AccountDetail />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="view_account" />,
                            },
                            {
                                path: 'view_account', element: <View_account />
                            },
                            {
                                path: 'orders/:userId', element: <OrderSumeries />
                            },
                            {
                                path: 'favourite', element: <YourFavourite />
                            },
                            {
                                path: 'sale', element: <Discount_code />
                            }
                        ]
                    },
                    {
                        path: '/orders/:id/return',
                        element: <Hoandon />,

                    },
                    // {
                    //     path: '/hoan/:id/',
                    //     element: <Hoan />,

                    // },
                ],
            },
        ],

    },
    {
        path: '/account',
        children: [
            {
                path: 'signup',
                element: <Signup />,
            },
            {
                path: 'signin',
                element: <Signin />,
            },

            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'change-password',
                element: <ChangePassword />
            },
            {
                path: 'verify-email',
                element:  <VerifyEmail/>
            }

        ],
    },

    {
        path: 'success/:id',
        element: <CheckoutSuccess />,
    },
    {
        path: 'cancelled/:id',
        element: <CancelCheckout />
    },
    // Admin
    {
        path: "/admin",
        element: <PrivateRoute isAuth={true} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Navigate to="dashboard" /> },
                    { path: 'dashboard', element: <DashBoard /> },
                    { path: 'product', element: <ListProduct /> },
                    { path: 'category', element: <ListCategory /> },
                    { path: 'user', element: <ListUser /> },
                    { path: 'user/update/:id', element: <UpdateUser /> },
                    { path: 'test', element: <AppTest /> },
                    { path: 'order', element: <ListOrder /> },
                    { path: 'sale', element: <ListSale /> },
                    { path: 'order-review', element: <ListComment /> },
                    { path: 'color', element: <ListColor /> },
                    { path: 'size', element: <ListSize /> },
                    { path: 'brand', element: <Listbrand /> },
                    { path: 'view_account', element: <View_account /> },
                    { path: 'revenue', element: <Revenue /> },
                    { path: 'revenueMoth', element: <RevenueMoth /> },
                    { path: 'revenueYear', element: <RevenueYear /> },
                    { path: 'category/:id/products', element: <ProductsbyCategory/>},
                    { path: 'product/:id/detail', element: <ProductDetails/>},
                ],
            },
        ],
    },
    {
        path: "/nhanvien",
        element: <PrivateRoute isAuth={true}/>,
        children: [
            {
                element: <EditorLayout/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="category"/> 
                    },
                    {
                        path:'category',
                        element: <ListCategory/>
                    },
                    {
                        path:'product',
                        element: <ListProduct/>
                    },
                    {   path: 'color', 
                        element: <ListColor /> 
                    },
                    {   path: 'size', 
                        element: <ListSize /> 
                    },
                    {   path: 'view_account', 
                        element: <View_account /> 
                    },
                    {   path: 'category/:id/products', 
                        element: <ProductsbyCategory/>
                    },
                    {   path: 'product/:id/detail', 
                        element: <ProductDetails/>
                    },
                    {   path: 'order', 
                        element: <ListOrder /> 
                    },
                    {   path: 'sale', 
                        element: <ListSale /> 
                    },
                    {   path: 'view_account', 
                        element: <View_account /> },
                ]
            }
        ]
    }

]);
export default router;
