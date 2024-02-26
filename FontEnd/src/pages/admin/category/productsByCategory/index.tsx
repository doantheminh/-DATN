import { calculatePagination } from '@/components/modal/pagination';
import { useGetProductsQuery } from '@/services/product';
import { formartVND } from '@/utils/formartVND';
import { Avatar, Image, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SearchProps } from 'antd/es/input';

const ProductsbyCategory = () => {
    const [products, setProducts] = useState([] as any)
    const { id: categoryId } = useParams();
    const { isLoading } = useGetProductsQuery({});
    const getData = async () => {
        const data = await axios.get(`http://localhost:8080/api/categories/${categoryId}`)
        setProducts(data.data.products);
    }

    useEffect(() => {
        getData()
    }, []);

    const [currentPage, setCurrentPage] = useState(0);
    const perPage = 9; // Số sản phẩm hiển thị trên mỗi trang
    const paginationOptions = {
        currentPage,
        perPage,
        totalCount: products?.length || 0,
        data: products || [],
    };

    const { pageCount, currentPageItems } = calculatePagination(paginationOptions);

    const handlePageChange = (selectedPage: any) => {
        setCurrentPage(selectedPage.selected);
    };



    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="pl-6 text-xs font-medium py-3">
                            Ảnh
                        </th>
                        <th scope="col" className="text-center text-xs font-medium py-3">
                            Tên sản phẩm
                        </th>
                        <th scope="col" className="text-center text-xs font-medium py-3">
                            Số Lượng
                        </th>
                        <th scope="col" className="pr-4 text-center text-xs font-medium py-3">
                            Giá
                        </th>
                    </tr>
                </thead>
                {isLoading ? (
                    <tbody>
                        <tr>
                            <td colSpan={7}>
                                <Skeleton count={3} className="h-[98px]" />
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody>
                        {currentPageItems?.map((product: any) => (
                            <tr
                                key={product._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="pl-6">
                                    <Avatar.Group maxCount={3}>
                                        {product.images && product.images[0] && (
                                            <div style={{ borderRadius: '50%' }}>
                                                <Image
                                                    src={product.images[0]}
                                                    alt="image"
                                                    width={80}
                                                    height={80}
                                                />
                                            </div>
                                        )}
                                    </Avatar.Group>
                                </td>
                                <td className="px-1 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {product.name.slice(0, 20)}...
                                </td>
                                <td className="text-center py-4">
                                    {product.inStock > 0 ? product.inStock : <span className='text-red-500'>Hết hàng</span>}
                                </td>
                                <td className="pr-4 text-center py-4">{formartVND(product.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                )}
                <div className="mt-4 p-3 d-flex justify-content-start align-items-start">
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp theo'}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination flex justify-center gap-1 text-xs font-medium'}
                        activeClassName={
                            'block h-8 w-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-blue-500'
                        }
                        pageClassName={
                            'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'
                        }
                        previousClassName={
                            'inline-flex  w-[60px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                        }
                        nextClassName={
                            'inline-flex  w-[70px] h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180'
                        }
                        previousLinkClassName={'h-8 p-1 leading-6 '}
                        nextLinkClassName={'h-8 p-1 leading-6 '}
                        breakClassName={
                            'block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900'
                        }
                    />
                </div>
            </table>
        </div>
    )
}

export default ProductsbyCategory
