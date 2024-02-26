import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import type { RadioChangeEvent } from 'antd';
import { Avatar, Image, Radio, Rate, Skeleton, Tabs } from 'antd';
import { TabsPosition } from 'antd/es/tabs';
import { useParams } from 'react-router-dom';
import { useGetProductByIdQuery } from '@/services/product';
import { useAppDispatch } from '@/store/hook';
import Loading from '@/components/ui/Loading';
import { formartVND } from '@/utils/formartVND';
const ProductDetails = () => {
    const { id } = useParams();
    const { data, isLoading } = useGetProductByIdQuery(id!);
    const [mode, setMode] = useState<TabsPosition>('top');
    const [value, setValue] = useState(3);
    const [color, setColor] = useState(data?.colorId![0]?.name);
    const [size, setSize] = useState(data?.sizeId![0]?.name);
    const [isActive, setIsActive] = useState(false as any);

    const hasSale = data?.price! - (data?.price! * data?.sale_off!) / 100;
    const myCategoryId = data?.categoryId?._id;
    useEffect(() => {
        setColor(data?.colorId![0]?.name);
        setSize(data?.sizeId![0]?.name);    
        setIsActive(data?.active);
    }, [data]);
    useEffect(() => {
        window.scroll(0, 0);
    }, [data]);
    const onChange3 = ({ target: { value } }: RadioChangeEvent) => {
        setColor(value);
    };

    const handleModeChange = (e: RadioChangeEvent) => {
        setMode(e.target.value);
    };

    return (
        <section className="py-4 font-poppins dark:bg-gray-800">
            {isLoading ? (
                <div className="h-screen">
                    <Loading />
                </div>
            ) : (
                <div>
                    {data && (
                        <div>
                            <div className=" max-w-5xl px-4 mx-auto">
                                <div className="flex flex-wrap mb-24 -mx-4">
                                    <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
                                        <div className="sticky top-0 overflow-hidden ">
                                            <Carousel autoPlay>
                                                {data?.images?.map((item, index) => (
                                                    <div key={index} className="h-[500px]">
                                                        <img
                                                            className="rounded-lg object-cover" width={100} height={100}
                                                            alt={item}
                                                            src={item}
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        </div>
                                    </div>
                                    <div className="w-full px-4 md:w-1/2">
                                        <div className="lg:pl-20">
                                            <div className="mb-6 ">
                                                {/* <span className="px-2.5 py-0.5 text-xs text-white !bg-primary rounded-xl">

                                                </span> */}
                                                <td className="max-w-xl w-22 mr-6  font-semibold dark:text-gray-400">
                                                    Tên sản phẩm: <span>{data.name}</span>
                                                </td>
                                                <p className="max-w-xl w-22 mr-6  font-semibold dark:text-gray-400">
                                                    Danh mục: <span className=' text-inherit'>{data?.categoryId?.name}</span >
                                                </p>
                                                <p className="inline-block text-2xl font-semibold text-rose-700 dark:text-gray-400 text-amber-700 ">
                                                    {formartVND(hasSale)}
                                                    <span className="ml-3 text-base font-normal text-gray-500 line-through dark:text-gray-400">
                                                        <span >{formartVND(data?.price)}</span>
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex items-center mb-8 mt-0">
                                                <h2 className="w-22  font-semibold dark:text-gray-400 ">
                                                    Màu Sắc:
                                                </h2>
                                                <div className="flex flex-wrap ml-2">
                                                    <div className='flex'>
                                                        {data?.colorId?.map((color) => (
                                                            <table key={color?._id} value={color?.name}>
                                                                {color?.name}
                                                            </table>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center mb-8">
                                                <h2 className="w-25  font-semibold dark:text-gray-400 flex">
                                                    Kích Cỡ:
                                                </h2>
                                                <div className="flex-1 flex-wrap mx-2 -mb-2">
                                                    <Radio.Group
                                                        onChange={(e) => setSize(e.target.value)}
                                                        value={size}
                                                        optionType="button"
                                                    >
                                                        {data?.sizeId?.map((size) => (
                                                            <Radio key={size?._id} value={size?.name}>
                                                                {size?.name}
                                                            </Radio>
                                                        ))}
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                            <div className="w-32 mb-8 ">
                                                <div className="w-full  font-semibold text-gray-700 dark:text-gray-400">
                                                    Số Lượng : {data.inStock}
                                                </div>
                                            </div>
                                            <div className="max-w-xl w-22 mr-6  font-semibold dark:text-gray-400 ">
                                                <div className="w-full font-semibold text-gray-700 dark:text-gray-400">
                                                    Trạng thái: {isActive ? 'Hoạt động' : 'Không hoạt động'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-5xl px-4 mx-auto">
                                <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                                    <Radio.Button value="top">Ngang</Radio.Button>
                                    <Radio.Button value="left">Dọc</Radio.Button>
                                </Radio.Group>
                                <Tabs
                                    defaultActiveKey="1"
                                    tabPosition={mode}
                                    style={{ height: 320, fontSize: 16 }}
                                    items={[
                                        {
                                            label: `Mô tả`,
                                            key: 'a',
                                            children: `
                            ${data?.description}
                            `,
                                        },
                                        {
                                            label: `Chức năng sản phẩm`,
                                            key: 'b',
                                            children: `Condof tab`,
                                        },
                                    ]}
                                />
                            </div>
                        </div>

                    )}
                </div>
            )}
        </section>

    );
};

export default ProductDetails




