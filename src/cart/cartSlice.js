import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        grandTotal: 0
    },
    reducers: {
        addItem: (state, action) => {
            const { product } = action.payload;
            const existingItem = state.items.find((item) => item.product.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.subtotal = existingItem.quantity * existingItem.product.unitPrice;
            } else {
                state.items.push({
                    product,
                    quantity: 1,
                    subtotal: product.unitPrice
                });
                state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
            }
        },
        removeItem: (state, action) => {
            const { id } = action.payload;
            const existingItem = state.items.find((item) => item.product.id === id);

            if (existingItem) {
                state.items = state.items.filter((item) => item.product.id !== id);
                // state.grandTotal = state.grandTotal -= state.items.subtotal;
                state.grandTotal = state.items.reduce((total, item) => (total += item.subtotal), 0);
            }
        },
        incrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.product.id === id);
            state.items[index].quantity++;
            state.items[index].subtotal = state.items[index].product.unitPrice * state.items[index].quantity;
            state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
        },

        decrementQuantity: (state, action) => {
            const { id } = action.payload;
            const index = state.items.findIndex((item) => item.product.id === id);
            if (state.items[index].quantity > 1) {
                state.items[index].quantity--;
                state.items[index].subtotal = state.items[index].product.unitPrice * state.items[index].quantity;
                state.grandTotal = state.items.reduce((total, item) => total + item.subtotal, 0);
            }
        }
    }
});

export const { addItem, removeItem, incrementQuantity, decrementQuantity } = cartSlice.actions;

export default cartSlice.reducer;
