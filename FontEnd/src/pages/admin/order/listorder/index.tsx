import { useGetsOrderQuery, useUpdateOrderStatusMutation } from '@/services/order';
import Skeleton from 'react-loading-skeleton';
import { Status } from '@/types/status';
import { Button, Form, Input, InputRef, Modal, Popconfirm, Select, Space, Table, Typography, message } from 'antd';
import { IOrder } from '@/types/order';
import { useEffect, useRef, useState } from 'react';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { AiOutlineSearch } from 'react-icons/ai';
import Highlighter from 'react-highlight-words';
import Loading from '@/components/ui/Loading';
import { formartVND } from '@/utils/formartVND';
import { CheckCircleOutlined, LoadingOutlined, PrinterOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import Hoadon from './print';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Hoan from './Hoan';
import { FaAngleDoubleDown } from 'react-icons/fa';
import axios from 'axios';
type DataIndex = keyof IOrder;

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: IOrder;
    index: number;
    children: React.ReactNode;
}

const { Option } = Select;
const { confirm } = Modal;

const renderState = (state: number) => {
    if (Status.CANCELLED === state) return <span className="text-red-500">Đã hủy</span>;
    if (Status.INFORMATION === state)
        return (
            <span>
                {' '}
                Chờ xác nhận <LoadingOutlined />
            </span>
        );
    if (Status.ORDER_CONFIRM === state) return <span>Xác nhận đơn hàng</span>;
    if (Status.SHIPPING === state) return <span>Đang giao hàng</span>;
    if (Status.COMPLETE === state)
        return (
            <span className="text-green-500">
                <CheckCircleOutlined /> Hoàn thành
            </span>
        );
};

const renderMethod = (method: number) => {
    if (method === 0) return <span className="text-yellow-500">Thanh toán khi nhận hàng</span>;
    if (method === 1) return <span className="text-green-500">Đã thanh toán</span>;
};

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = (
        <Select>
            <Option disabled={record?.status >= Status.INFORMATION} value={1}>
                {renderState(1)}
            </Option>
            <Option disabled={record?.status >= Status.ORDER_CONFIRM} value={2}>
                {renderState(2)}
            </Option>
            <Option disabled={record?.status >= Status.SHIPPING} value={3}>
                {renderState(3)}
            </Option>
            <Option disabled={record?.status >= Status.COMPLETE} value={4}>
                {renderState(4)}
            </Option>
        </Select>
    );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={'status'}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
import { DatePicker } from 'antd';
import AdminTimelineOrder from '@/components/modal/AdminTimelineOrder';
import { useGetProductsQuery } from '@/services/product';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

const StyledSelectedRow = styled(Table)`
    .ant-table-cell {
        .ant-checkbox-wrapper {
            .ant-checkbox-inner {
                border-radius: 0;
            }
        }
    }

    .ant-table-row-selected {
        background-color: #ccc;
    }
`;

const ListOrder: React.FC = () => {
    const { data: productData } = useGetProductsQuery({});

    // Query
    const [searchParams, _setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    const startDate = searchParams.get('startDate') || "";
    const endDate = searchParams.get('endDate') || "";

    const { data, isLoading } = useGetsOrderQuery({
        startDate: startDate!,
        endDate: endDate!,
    });

    //
    const [orders, setOrders] = useState<IOrder[]>([]);

    const handleDateRangeChange = (_dates: any, dateStrings: string[]) => {
        navigate({
            pathname: '',
            search: `?startDate=${dateStrings[0]}&endDate=${dateStrings[1]}`,
        });
    };
    const [changeOrderStatus] = useUpdateOrderStatusMutation();
    const [form] = Form.useForm();

    // State
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [editingKey, setEditingKey] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    //print
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const handleButtonClick = (orderId: string) => {
        setShowModal(true);
        setSelectedOrderId(orderId);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Filtering Data

    useEffect(() => {
        setOrders(data?.docs?.filter((order) => order.isPaid === true) as any);
    }, [data]);

    // selection

    const onSelectChange = (newSelectedRowKeys: string[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: any = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // Filtering Order

    const [filterStatus, setFilterStatus] = useState<number | null>(null);

    const handleFilterByStatus = (status: number) => {
        const filteredData = data?.docs.filter((order) => order.status === status);
        setOrders(filteredData!);
        setFilterStatus(status);
    };

    const onChangeMethod = (value: string) => {
        if (value === 'all') {
            setOrders(data?.docs?.filter((order) => order.isPaid === true)!);
        } else {
            const filterIsPaidFalse = data?.docs?.filter(
                (order) => order.payMethod === Number(value) && order.isPaid === true,
            );
            setOrders(filterIsPaidFalse!);
        }
    };

    // Editting

    const isEditing = (record: IOrder) => record._id === editingKey;

    const edit = (record: Partial<IOrder> & { key: string }) => {
        form.setFieldsValue({ status: 0, ...record });
        setEditingKey(record._id!);
        setProducts(record?.products!);
    };

    const cancel = () => {
        setEditingKey('');
    };

    // Save inStock

    function timeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const makeRequestInStock = async () => {
        let holder: any = {};

        products?.forEach((d) => {
            if (holder.hasOwnProperty(d._id)) {
                holder[d._id] = holder[d._id] + d.quantity;
            } else {
                holder[d._id] = d.quantity;
            }
        });

        let obj2 = [];

        for (const prop in holder) {
            obj2.push({ key: prop, value: holder[prop] });
        }

        await timeout(1000);

        obj2.map(async (obj) => {
            await axios.patch(`http://localhost:8080/api/products/instock/${obj.key}`, {
                value: obj.value,
            });
        });
    };

    const save = async (id: string) => {
        const row = (await form.validateFields()) as IOrder;

        const inStock = productData?.docs?.find((item) => item.inStock <= 0);

        if (inStock?.inStock! <= 0) {
            return message.warning(
                `${inStock?.name} hiện đã hết hàng. Vui lòng nhập thêm hàng để tiếp tục đơn hàng 🥰`,
            );
        } else {
            try {
                const newData = [...data?.docs!];
                await changeOrderStatus({
                    orderId: editingKey,
                    ids: selectedRowKeys,
                    status: Number(row.status) as number,
                })
                    .then(() => {
                        if (Number(row.status) >= Status.ORDER_CONFIRM) {
                            return makeRequestInStock();
                        }
                    })
                    .then(() => {
                        message.success('Cập nhật trạng thái đơn hàng thành công');
                        setSelectedRowKeys([]);
                    });
                const index = newData.findIndex((item) => id === item._id);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...row,
                    });
                    setEditingKey('');
                } else {
                    setEditingKey('');
                }
            } catch (error: any) {
                return message.error(error.message);
            }
        }
    };

    const searchInput = useRef<InputRef>(null);
    //
    const [open, setOpen] = useState(false);

    const onShow = () => {
        setOpen(true);
    };

    //
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOrder> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="default"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<AiOutlineSearch />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <AiOutlineSearch style={{ fontSize: 20, color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            width: '25%',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: '15%',

            render: (phone: number) => {
                return <span>0{phone}</span>;
            },
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (value: number) => renderState(value),
            width: '20%',
            editable: true,
        },
        {
            title: 'Thanh toán',
            dataIndex: 'payMethod',
            render: (value: number) => renderMethod(value),
            width: '20%',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            fixed: 'right',
            render: (_: any, record: IOrder) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            style={{ marginRight: 8 }}
                            onClick={() => save(record._id)}
                            className="border p-2 rounded"
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn có muốn hủy?" onConfirm={cancel} okType="default">
                            <a>Hủy</a>
                        </Popconfirm>
                    </span>
                ) : record.status === Status.DANHGIA ? (
                    <Space className="flex flex-col">
                        {/* <div className="">
                            <div className="flex">
                                <Button type="dashed" className="bg-reds px-2.5 text-layer">
                                    xác nhận
                                </Button>
                            </div>
                        </div> */}
                        <div className=" md:ml-0 ml-20">
                            <Link to={`/hoan/${record._id}`}>
                                <Button type="dashed" className="bg-gree text-layer" onClick={onShow}>
                                    chi tiết
                                </Button>
                            </Link>
                            <Modal
                                title="Update User"
                                centered
                                open={open}
                                onOk={() => setOpen(false)}
                                onCancel={() => setOpen(false)}
                                width={1000}
                                footer={null}
                            >
                                <Hoan />
                            </Modal>
                        </div>
                    </Space>
                ) : (
                    <Space className="flex flex-col">
                        {/* Your existing buttons */}
                        <Button
                            disabled={
                                editingKey !== '' ||
                                record.status === Status.CANCELLED ||
                                record.status === Status.COMPLETE
                            }
                            onClick={() => edit(record as any)}
                            className="bg-gree text-layer"
                        >
                            Cập nhật
                        </Button>

                        <Button
                            disabled={record.status === Status.CANCELLED || record.status === Status.COMPLETE || record.status >= Status.ORDER_CONFIRM}
                            type="primary"
                            danger
                            onClick={() => showDeleteConfirm(record)}
                        >
                            Hủy đơn
                        </Button>
                        <div className="px-1 md:ml-0">
                            <div className="flex">
                                <Button
                                    disabled={record.status === Status.CANCELLED || record.status === Status.COMPLETE}
                                    className="  rounded-md px-6 flex items-center bg-primary text-layer"
                                    onClick={() => handleButtonClick(record._id)}
                                >
                                    <PrinterOutlined /> in
                                </Button>
                            </div>
                            <Modal
                                title="Hóa Đơn"
                                open={showModal}
                                onCancel={handleCloseModal}
                                destroyOnClose={true}
                                width={1900}
                                style={{ maxWidth: 900 }}
                                centered
                                footer={null}
                            >
                                <div className="max-w-3xl mx-auto">
                                    <Hoadon orderId={selectedOrderId} />
                                </div>
                            </Modal>
                        </div>
                    </Space>
                );
            },
            width: '10%',
        },
    ];

    const showDeleteConfirm = (record: IOrder) => {
        confirm({
            title: (
                <p>
                    Bạn có thực sự muốn hủy đơn hàng của khách hàng{' '}
                    <span className="text-red-500">{record.fullName}</span>?
                </p>
            ),
            content: (
                <p>
                    Vui lòng cân nhắc trước khi hủy đơn - Mã Đơn Hàng{' '}
                    <span className="text-red-500">{record.orderNumber}</span>
                </p>
            ),
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const row = (await form.validateFields()) as IOrder;

                    const newData = [...data?.docs!];

                    await changeOrderStatus({
                        orderId: record._id,
                        status: 0,
                    });

                    message.destroy('Đơn hàng đã được hủy thành công');

                    const index = newData.findIndex((item) => editingKey === item._id);

                    if (index > -1) {
                        const item = newData[index];

                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                        });

                        setEditingKey('');
                    } else {
                        setEditingKey('');
                    }
                } catch (errInfo) {
                    console.log('Validate Failed:', errInfo);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const mergedColumns = columns?.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IOrder) => ({
                record,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div className="flex gap-x-2 mb-4 p-3 flex-wrap gap-y-2">
                        <Select onChange={onChangeMethod} defaultValue={'all'}>
                            {/* <Option value={Status.INFORMATION}>Xác thực thông tin</Option> */}
                            <Option value={'all'}>Tất cả đơn hàng</Option>
                            <Option value={'0'}>Hàng trả sau</Option>
                            <Option value={'1'}>Hàng đã thanh toán</Option>
                        </Select>

                        <Select onChange={handleFilterByStatus} placeholder="Hàng theo trạng thái">
                            <Option value={Status.INFORMATION}>Chờ xác nhận</Option>
                            <Option value={Status.ORDER_CONFIRM}>Xác nhận đơn hàng</Option>
                            <Option value={Status.SHIPPING}>Đang giao hàng</Option>
                            <Option value={Status.COMPLETE}>Hoàn thành</Option>
                            <Option value={Status.CANCELLED}>Đã hủy</Option>
                        </Select>

                        <AdminTimelineOrder />

                        <div className="flex-grow text-right">
                            <RangePicker
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    </div>

                    <Form form={form} component={false}>
                        <StyledSelectedRow
                            rowSelection={rowSelection}
                            pagination={{
                                defaultPageSize: 20,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '30'],
                            }}
                            bordered
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            className="overflow-x-scroll"
                            scroll={{ x: 1300 }}
                            columns={mergedColumns as any}
                            dataSource={orders}
                            rowKey={'_id'}
                            expandable={{
                                columnWidth: '3%',
                                expandIcon: ({ onExpand, record }) => (
                                    <button onClick={(e: any) => onExpand(record, e)}>
                                        <FaAngleDoubleDown />
                                    </button>
                                ),
                                expandedRowRender: (record) => {
                                    return (
                                        <>
                                            {record && (
                                                <div>
                                                    <div className="space-y-2">
                                                        <h1>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Tên khách hàng :
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                {record?.fullName}
                                                            </span>
                                                        </h1>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Địa chỉ Email:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                {record?.email}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Số điện thoại:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                0{record?.phone}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Địa chỉ:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                {record?.shipping}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Trạng thái đơn hàng:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                {renderState(record?.status)}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Tổng số tiền:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold !text-primary">
                                                                {formartVND(record?.total)}
                                                            </span>
                                                        </p>
                                                        <p>
                                                            <span className="min-w-[150px] max-w-[150px] inline-block">
                                                                Ngày tạo đơn:
                                                            </span>{' '}
                                                            <span className="text-base font-semibold">
                                                                {new Date(record?.createdAt!)?.toLocaleDateString()}
                                                            </span>
                                                        </p>
                                                    </div>

                                                    <h1 className="mt-4 text-base font-semibold">Đơn hàng: </h1>

                                                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                            <tr>
                                                                <th></th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 text-xs font-medium py-3"
                                                                >
                                                                    Tên đơn hàng
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 text-xs font-medium py-3"
                                                                >
                                                                    Màu
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="px-6 text-xs font-medium py-3"
                                                                >
                                                                    Size
                                                                </th>
                                                                <th
                                                                    scope="col"
                                                                    className="text-left px-6 text-xs font-medium py-3"
                                                                >
                                                                    Số lượng
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
                                                                {record?.products.map((product: any, index) => (
                                                                    <tr key={index}>
                                                                        <td className="text-center bg-gray-100 shadow-sm">
                                                                            <Image
                                                                                width={55}
                                                                                height={55}
                                                                                src={product.images![index]}
                                                                                preview
                                                                            />
                                                                        </td>
                                                                        <td className="px-6 py-4 text-left bg-gray-100 shadow-sm">
                                                                            {product?.name}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-left bg-gray-100 shadow-sm">
                                                                            {product?.color}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-left bg-gray-100 shadow-sm">
                                                                            {product?.size}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-left bg-gray-100 shadow-sm">
                                                                            {product?.quantity}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        )}
                                                    </table>
                                                </div>
                                            )}
                                        </>
                                    );
                                },
                            }}
                        />
                    </Form>
                </>
            )}
        </>
    );
};

export default ListOrder;
