import { Checkbox, List } from 'antd';
import { FunctionComponent, useState } from 'react';
import { useGetProductsQuery } from '@/services/product';
import { useGetCategoriesQuery, useGetProductsByCategoryQuery } from '@/services/category';
import Loading from '@/components/ui/Loading';
import { useGetBrandsQuery, useGetColorsQuery } from '@/services/option';
import ReactPaginate from 'react-paginate';
import { calculatePagination } from '@/components/modal/pagination';
import ProductByid from '@/components/products/productBycategory';

interface FilterProductsProps { }

const FilterProducts: FunctionComponent<FilterProductsProps> = () => {
    const { data: productsData, isLoading } = useGetProductsQuery({ startDate: '', endDate: '' });
    const { data: categoriesData } = useGetCategoriesQuery({ startDate: '', endDate: '' });
    const { data: brands } = useGetBrandsQuery();
    console.log(brands);

    const { data: colors } = useGetColorsQuery();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategories((prevSelectedCategories) => {
            if (prevSelectedCategories.includes(categoryId)) {
                return prevSelectedCategories.filter((id) => id !== categoryId);
            } else {

                return [...prevSelectedCategories, categoryId];
            }
        });
    };

    const { data: getProductBycategory } = useGetProductsByCategoryQuery({
        categoryIds: selectedCategories.join(',')
    });

    // limit
    const [currentPage, setCurrentPage] = useState(0);
    const perPage = 8;
    const productList = productsData?.docs.filter((product) => product.active) || [];

    const paginationOptions = {
        currentPage,
        perPage,
        totalCount: productList.length,
        data: productList,
    };

    const { pageCount } = calculatePagination(paginationOptions);
    const handlePageChange = (selectedPage: any) => {
        setCurrentPage(selectedPage.selected);
    };


    let filteredProducts = productList.filter((product) => product.active); // Filter based on active == true

    // Apply filtering based on selected categories 
    if (selectedCategories.length > 0) {filteredProducts = filteredProducts.filter((product) =>
        selectedCategories.includes(product.category)
    );
}


const startIndex = currentPage * perPage;
const endIndex = (currentPage + 1) * perPage;

const currentPageItems = filteredProducts.slice(startIndex, endIndex);






return (
    <section className="py-6 min-h-screen bg-gray-50 font-poppins dark:bg-gray-800 ">
        {isLoading ? (
            <Loading />
        ) : (
            <div className="px-4 mx-auto lg:py-6 md:px-6">
                <div className="flex flex-wrap mx-auto mb-24">
                    <div className="w-full lg:w-1/6 lg:block">
                        <div className="bg-white text-lg p-2 shadow-sm">
                            <div className='overflow-y-auto max-h-[280px] relative'>
                                <h1 className='sticky bg-white h-[30px] z-50 top-0 left-0'>Danh mục</h1>
                                <List>
                                    {categoriesData?.docs.map((category) => (
                                        <List.Item key={category._id}>
                                            <Checkbox onChange={() => handleCategoryChange(category._id)}>{category.name}</Checkbox>
                                        </List.Item>
                                    ))}
                                </List>
                            </div>

                        </div>
                    </div>
                    <div className="w-full lg:w-3/4 flex-1">
                        {selectedCategories.length > 0 ? (
                            <div className={`grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4  items-center px-2`}>
                                {getProductBycategory?.map((product) =>
                                    product.active && (
                                        <div key={product._id} className="w-full mb-6"><ProductByid product={product} />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className={`grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4  items-center px-2`}>
                                {currentPageItems?.map((product) =>
                                    product.active && (
                                        <div key={product._id} className="w-full mb-6">
                                            <ProductByid product={product} />
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-6">
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
            </div>

        )
        }
    </section >
);
};

export default FilterProducts;