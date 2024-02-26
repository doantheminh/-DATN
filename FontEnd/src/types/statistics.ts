interface ProductInfo {
      _id: string;
      name: string;
      price: number;
      sale_off: null | number; // Sử dụng union type để cho phép giá trị null
      // Các trường khác nếu có
    }
    
    export interface Products {
      productInfo: ProductInfo;
      quantity: number;
      _id: string;
      // Các trường khác nếu có
    }
    