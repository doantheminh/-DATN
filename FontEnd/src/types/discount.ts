 export interface IDiscount {
      _id? : number | string,
      code: string;
      discount: number;
      maxAmount: number;
      count: number;
      startDate: Date;
      endDate: Date;
    }
    export interface PaginatedDiscount {
      docs: IDiscount[];
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
      nextPage: null;
      page: number;
      pagingCounter: number;
      prevPage: null;
      totalDocs: number;
      totalPages: number;
  }