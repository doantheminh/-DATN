import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { toast } from 'react-toastify';

type CartProps = {
    cartItems: any[];
};

const initialState: CartProps = {
    cartItems: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<any>) => {
            const newProduct = action.payload;

            const existingProduct = state.cartItems.find((item) => item._id === newProduct._id);

            if (!existingProduct) {
                state.cartItems.push({
                    ...newProduct,
                    color: newProduct?.color,
                    size: newProduct?.size,
                    quantity: newProduct.quantity || 1,
                });
                message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`,0.5);
            } else {
                existingProduct.quantity++;
                message.success(`Đã thêm ${newProduct.name} vào giỏ hàng`,0.5);

            }
        },
        increase: (state, action: PayloadAction<number>) => {
            const currentProduct = state.cartItems.find((_item, index) => index === action.payload);
            currentProduct.quantity++;
        },
        decrease: (state, action: PayloadAction<number>) => {
            const currentProduct = state.cartItems.find((_item, index) => index === action.payload);
            currentProduct.quantity--;

            if (currentProduct.quantity < 1) {
                state.cartItems = state.cartItems.filter((_item, index) => index !== action.payload);
                currentProduct.quantity = 1;
                toast.info(`Đã xóa khỏi giỏ hàng`, {
                    position: 'bottom-right',
                });
            }
        },
        remove: (state, action: PayloadAction<number>) => {
            state.cartItems = state.cartItems.filter((_item, index) => index !== action.payload);

            toast.info(`Đã xóa khỏi giỏ hàng`, {
                position: 'bottom-right',
            });
        },
        clear: (state) => {
            state.cartItems = [];
            toast.info(`Giỏ hàng đã được dọn sạch`, {
                position: 'bottom-right',
            });
        },
        update: (state, action) => {
            let exist = state.cartItems.findIndex((_item, index) => index === action.payload.index);

            state.cartItems[exist].color = action?.payload?.color;
            state.cartItems[exist].size = action?.payload?.size;

        }
    },
});

export const { addToCart, increase, decrease, clear, remove, update } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
