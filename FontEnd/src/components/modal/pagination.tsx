interface PaginationOptions {
    currentPage: number;
    perPage: number;
    totalCount: number;
    data: any[];
}

export function calculatePagination(options: PaginationOptions) {
    const { currentPage, perPage, totalCount } = options;
    const pageCount = Math.ceil(totalCount / perPage);
    const offset = currentPage * perPage;

    if (!Array.isArray(options?.data)) {
        console.error('Data is not an array'); // Có thể thay thế bằng cách hiển thị thông báo hoặc xử lý khác
        return {
            pageCount,
            offset,
            currentPageItems: [],
        };
    }

    return {
        pageCount,
        offset,
        currentPageItems: options.data.slice(offset, offset + perPage),
    };
}
