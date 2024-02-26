import { IDiscount } from "@/services/discount";

export interface PaginatedOrder {
      docs: IOrder[];
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
export interface IProductorder {
      _id?: number | string | any,
      quantity: number;
      name: string;
      price:number;
      colorId:string;
      sizeId:string;
      images: string[];
      sale_off: number;
      color?:string;
      size?:string;
      inStock?:number
      
}
export interface Iuser {
      _id: string;
      email: string;
      fullName: string;
}
export interface IOrder {
      _id: string;
      isPaid:boolean,
      orderNumber: string;
      status: number;
      phone: number;
      fullName: string;
      shipping: string;
      products: IProductorder[];
      userId: string;
      payMethod: number;
      total: number;
      createdAt: Date;
      updatedAt: Date;
      completed: boolean
      LydoHoandon:string;
      Motahoandon:string,
      Emaill:string,
      discountCode : IDiscount[];
}  
export interface Hoandon{
      LydoHoandon:string;
      Motahoandon:string,
      Emaill:string,
      order:IOrder[],
      products: IProductorder[];
}