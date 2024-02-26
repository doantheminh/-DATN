export const reduceTotal = (carts: any[], discountApplied?: boolean, discountAmount?: number) => {
    return carts.reduce((sum: number, item: any) => {
        // if (discountApplied) {
        //     const discountedPrice = item.price - (item.price * discountAmount!) / 100;
        //     return sum + discountedPrice * item.quantity;
        // } else {
            return sum + item.price * item.quantity;
        // }
    }, 0);
};
